using AutoMapper;
using CloudService.Application.Common;
using CloudService.Application.DTOs.ServicePlans;
using CloudService.Application.Interfaces;
using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;

namespace CloudService.Application.Services
{
    public class ServicePlanService : IServicePlanService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ServicePlanService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<PagedResponse<ServicePlanDto>> GetAllAsync(PaginationFilter filter)
        {
            var repo = _unitOfWork.Repository<ServicePlan>();
            var allData = await repo.GetAllAsync(includeProperties: "Prices,Category");
            
            var pagedData = allData
                .OrderByDescending(x => x.CreatedAt)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToList();

            var dtos = _mapper.Map<List<ServicePlanDto>>(pagedData);
            return new PagedResponse<ServicePlanDto>(dtos, allData.Count(), filter.PageNumber, filter.PageSize);
        }

        public async Task<ServicePlanDto?> GetByIdAsync(Guid id)
        {
            var repo = _unitOfWork.Repository<ServicePlan>();
            var allData = await repo.GetAllAsync(includeProperties: "Prices,Category");
            var entity = allData.FirstOrDefault(x => x.Id == id);
            if (entity == null) return null;
            return _mapper.Map<ServicePlanDto>(entity);
        }

        public async Task<ServicePlanDto> CreateAsync(CreateServicePlanDto dto)
        {
            var catRepo = _unitOfWork.Repository<ServiceCategory>();
            if (await catRepo.GetByIdAsync(dto.CategoryId) == null)
            {
                throw new Exception("Category not found");
            }

            var entity = _mapper.Map<ServicePlan>(dto);
            await _unitOfWork.Repository<ServicePlan>().AddAsync(entity);
            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<ServicePlanDto>(entity);
        }

        public async Task<ServicePlanDto> UpdateAsync(Guid id, UpdateServicePlanDto dto)
        {
            var repo = _unitOfWork.Repository<ServicePlan>();
            var allData = await repo.GetAllAsync(includeProperties: "Prices,Category");
            var entity = allData.FirstOrDefault(x => x.Id == id);
            if (entity == null) throw new Exception("Plan not found");

            var catRepo = _unitOfWork.Repository<ServiceCategory>();
            if (await catRepo.GetByIdAsync(dto.CategoryId) == null)
            {
                throw new Exception("Category not found");
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
                    throw new Exception("Không thể cập nhật/xóa bảng giá vì đang có Đơn Hàng sử dụng giá cũ. Vui lòng giữ nguyên các mốc thời gian đã tạo.");
                }
                throw new Exception("Lỗi cập nhật dữ liệu: " + (ex.InnerException?.Message ?? ex.Message));
            }

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
                    throw new Exception("Không thể xóa Dịch Vụ này vì đang có Đơn Hàng sử dụng nó.");
                }
                throw new Exception("Lỗi xóa dữ liệu: " + (ex.InnerException?.Message ?? ex.Message));
            }
            return true;
        }
    }
}
