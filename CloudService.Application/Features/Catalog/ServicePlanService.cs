using AutoMapper;
using System.Text.Json;
using CloudService.Application.Common;
using CloudService.Application.DTOs.ServicePlans;
using CloudService.Application.Interfaces;
using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;
using CloudService.Domain.Exceptions;

namespace CloudService.Application.Services
{
    public class ServicePlanService : IServicePlanService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IQRCodeService _qrCodeService;

        public ServicePlanService(IUnitOfWork unitOfWork, IMapper mapper, IQRCodeService qrCodeService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _qrCodeService = qrCodeService;
        }

        public async Task<PagedResponse<ServicePlanDto>> GetAllAsync(PaginationFilter filter)
        {
            var repo = _unitOfWork.Repository<ServicePlan>();
            var totalRecords = await repo.CountAsync(query => query);
            var pagedData = await repo.ToListAsync(query => query
                .OrderByDescending(x => x.CreatedAt)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize),
                includeProperties: "Prices,Category,PackageSpecifications");

            foreach (var plan in pagedData.Where(plan => string.IsNullOrWhiteSpace(plan.QRCodeBase64)))
            {
                // Sinh tạm khi đọc để public page không bị trống nếu dữ liệu cũ chưa được backfill.
                // Admin regenerate vẫn là luồng lưu QR chính thức vào database.
                plan.QRCodeBase64 = _qrCodeService.GenerateQRCodeBase64(BuildQrPayload(plan));
            }

            var dtos = _mapper.Map<List<ServicePlanDto>>(pagedData);
            return new PagedResponse<ServicePlanDto>(dtos, totalRecords, filter.PageNumber, filter.PageSize);
        }

        public async Task<ServicePlanDto?> GetByIdAsync(Guid id)
        {
            var repo = _unitOfWork.Repository<ServicePlan>();
            var entity = await repo.GetByIdAsync(id, includeProperties: "Prices,Category,PackageSpecifications");
            if (entity == null) return null;
            return _mapper.Map<ServicePlanDto>(entity);
        }

        public async Task<ServicePlanDto> CreateAsync(CreateServicePlanDto dto)
        {
            var catRepo = _unitOfWork.Repository<ServiceCategory>();
            if (await catRepo.GetByIdAsync(dto.CategoryId) == null)
            {
                throw new NotFoundException("Category not found");
            }

            var entity = _mapper.Map<ServicePlan>(dto);
            await _unitOfWork.Repository<ServicePlan>().AddAsync(entity);
            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<ServicePlanDto>(entity);
        }

        public async Task<ServicePlanDto> UpdateAsync(Guid id, UpdateServicePlanDto dto)
        {
            var repo = _unitOfWork.Repository<ServicePlan>();
            var entity = await repo.GetByIdAsync(id, includeProperties: "Prices,Category,PackageSpecifications");
            if (entity == null) throw new NotFoundException("Plan not found");

            var catRepo = _unitOfWork.Repository<ServiceCategory>();
            if (await catRepo.GetByIdAsync(dto.CategoryId) == null)
            {
                throw new NotFoundException("Category not found");
            }

            var oldPrices = entity.Prices.ToList();
            
            _mapper.Map(dto, entity);
            
            if (dto.Prices != null)
            {
                var existingPrices = entity.Prices.ToList();
                var priceRepo = _unitOfWork.Repository<PlanPrice>();

                foreach (var priceDto in dto.Prices)
                {
                    int cycle = int.Parse(priceDto.BillingCycle);
                    var existing = existingPrices.FirstOrDefault(p => p.BillingCycle == cycle);
                    if (existing != null)
                    {
                        existing.Price = priceDto.Price;
                        existing.SetupFee = priceDto.SetupFee ?? 0;
                        existing.UpdatedAt = DateTime.UtcNow;
                        
                        existingPrices.Remove(existing);
                    }
                    else
                    {
                        var newPrice = _mapper.Map<PlanPrice>(priceDto);
                        entity.Prices.Add(newPrice);
                        await priceRepo.AddAsync(newPrice);
                    }
                }

                foreach (var oldPrice in existingPrices)
                {
                    priceRepo.Delete(oldPrice);
                }
            }
            
            try
            {
                await _unitOfWork.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                if (ex.InnerException != null && ex.InnerException.Message.Contains("REFERENCE constraint"))
                {
                    throw new ConflictException("Không thể cập nhật/xóa bảng giá vì đang có Đơn Hàng sử dụng giá cũ. Vui lòng giữ nguyên các mốc thời gian đã tạo.");
                }
                throw new ValidationException("Lỗi cập nhật dữ liệu: " + (ex.InnerException?.Message ?? ex.Message));
            }

            return _mapper.Map<ServicePlanDto>(entity);
        }

        private static string BuildQrPayload(ServicePlan plan)
        {
            var cpu = "-";
            var ram = "-";
            var ssd = "-";
            try
            {
                using var document = JsonDocument.Parse(string.IsNullOrWhiteSpace(plan.Specifications) ? "{}" : plan.Specifications);
                var specs = document.RootElement;
                cpu = ReadSpec(specs, "CPU");
                ram = ReadSpec(specs, "RAM");
                ssd = ReadSpec(specs, "SSD");
            }
            catch (JsonException)
            {
                // Giữ payload QR hợp lệ nếu dữ liệu cấu hình cũ không phải JSON chuẩn.
            }

            var priceSummary = string.Join(",", plan.Prices
                .OrderBy(price => price.BillingCycle)
                .Select(price => $"{price.BillingCycle}:{price.Price + price.SetupFee:0.##}"));
            return $"CLOUDNOVA|SERVICE_PLAN|{plan.Id}|{plan.Name}|CPU:{cpu}|RAM:{ram}|SSD:{ssd}|PRICES:{priceSummary}";
        }

        private static string ReadSpec(JsonElement specs, string key)
        {
            return specs.TryGetProperty(key, out var value) ? value.ToString() : "-";
        }

        public async Task<ServicePlanDto?> RegenerateQrCodeAsync(Guid id)
        {
            var repo = _unitOfWork.Repository<ServicePlan>();
            var entity = await repo.GetByIdAsync(id, includeProperties: "Prices,Category,PackageSpecifications");
            if (entity == null) return null;

            entity.QRCodeBase64 = _qrCodeService.GenerateQRCodeBase64(BuildQrPayload(entity));
            // Entity đã được DbContext tracking; chỉ lưu thay đổi QRCodeBase64.
            // Không gọi Update vì Prices/Category đã được Include và không cần đánh dấu Modified.
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<ServicePlanDto>(entity);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var repo = _unitOfWork.Repository<ServicePlan>();
            var entity = await repo.GetByIdAsync(id);
            if (entity == null) return false;

            repo.Delete(entity);
            try
            {
                await _unitOfWork.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                if (ex.InnerException != null && ex.InnerException.Message.Contains("REFERENCE constraint"))
                {
                    throw new ConflictException("Không thể xóa Dịch Vụ này vì đang có Đơn Hàng sử dụng nó.");
                }
                throw new ValidationException("Lỗi xóa dữ liệu: " + (ex.InnerException?.Message ?? ex.Message));
            }
            return true;
        }
    }
}
