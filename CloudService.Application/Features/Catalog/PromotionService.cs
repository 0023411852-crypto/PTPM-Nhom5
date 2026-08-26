using AutoMapper;
using CloudService.Application.Common;
using CloudService.Application.DTOs.Promotions;
using CloudService.Application.Interfaces;
using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;
using CloudService.Domain.Exceptions;

namespace CloudService.Application.Services
{
    public class PromotionService : IPromotionService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public PromotionService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<PagedResponse<PromotionDto>> GetAllAsync(PaginationFilter filter, bool onlyActive = false)
        {
            var repo = _unitOfWork.Repository<Promotion>();
            var totalRecords = await repo.CountAsync(query => onlyActive
                ? query.Where(x => x.IsActive && (x.EndDate == null || x.EndDate > DateTime.UtcNow))
                : query, "ServicePlans");
            var pagedData = await repo.ToListAsync(query => (onlyActive
                    ? query.Where(x => x.IsActive && (x.EndDate == null || x.EndDate > DateTime.UtcNow))
                    : query)
                .OrderByDescending(x => x.IsFeatured)
                .ThenByDescending(x => x.StartDate)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize), "ServicePlans");

            var dtos = _mapper.Map<List<PromotionDto>>(pagedData);
            return new PagedResponse<PromotionDto>(dtos, totalRecords, filter.PageNumber, filter.PageSize);
        }

        public async Task<PromotionDto?> GetByIdAsync(Guid id)
        {
            var repo = _unitOfWork.Repository<Promotion>();
            var entity = await repo.GetByIdAsync(id, includeProperties: "ServicePlans");
            if (entity == null) return null;
            return _mapper.Map<PromotionDto>(entity);
        }

        public async Task<PromotionDto> CreateAsync(CreatePromotionDto dto)
        {
            var entity = _mapper.Map<Promotion>(dto);
            
            if (dto.ServicePlanIds != null && dto.ServicePlanIds.Any())
            {
                var planRepo = _unitOfWork.Repository<ServicePlan>();
                entity.ServicePlans = await planRepo.ToListAsync(query => query
                    .Where(p => dto.ServicePlanIds.Contains(p.Id)));
            }

            await _unitOfWork.Repository<Promotion>().AddAsync(entity);
            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<PromotionDto>(entity);
        }

        public async Task<PromotionDto> UpdateAsync(Guid id, UpdatePromotionDto dto)
        {
            var repo = _unitOfWork.Repository<Promotion>();
            var entity = await repo.GetByIdAsync(id, includeProperties: "ServicePlans");
            if (entity == null) throw new NotFoundException("Promotion not found");

            _mapper.Map(dto, entity);

            if (dto.ServicePlanIds != null)
            {
                var planRepo = _unitOfWork.Repository<ServicePlan>();
                var selectedPlans = await planRepo.ToListAsync(query => query
                    .Where(p => dto.ServicePlanIds.Contains(p.Id)));
                
                // Xóa chỉ những plan không còn trong danh sách mới
                var plansToRemove = entity.ServicePlans
                    .Where(p => !dto.ServicePlanIds.Contains(p.Id))
                    .ToList();
                foreach (var plan in plansToRemove)
                    entity.ServicePlans.Remove(plan);

                // Thêm chỉ những plan chưa có trong collection
                foreach (var plan in selectedPlans)
                {
                    if (!entity.ServicePlans.Any(p => p.Id == plan.Id))
                        entity.ServicePlans.Add(plan);
                }
            }

            repo.Update(entity);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<PromotionDto>(entity);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var repo = _unitOfWork.Repository<Promotion>();
            var entity = await repo.GetByIdAsync(id);
            if (entity == null) return false;

            repo.Delete(entity);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
    }
}
