using AutoMapper;
using CloudService.Application.Common;
using CloudService.Application.DTOs.Promotions;
using CloudService.Application.Interfaces;
using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;

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
            var allData = await repo.GetAllAsync();

            if (onlyActive)
            {
                allData = allData.Where(x => x.IsActive && (x.EndDate == null || x.EndDate > DateTime.UtcNow));
            }

            var pagedData = allData
                .OrderByDescending(x => x.IsFeatured)
                .ThenByDescending(x => x.StartDate)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToList();

            var dtos = _mapper.Map<List<PromotionDto>>(pagedData);
            return new PagedResponse<PromotionDto>(dtos, allData.Count(), filter.PageNumber, filter.PageSize);
        }

        public async Task<PromotionDto?> GetByIdAsync(Guid id)
        {
            var repo = _unitOfWork.Repository<Promotion>();
            var entity = await repo.GetByIdAsync(id);
            if (entity == null) return null;
            return _mapper.Map<PromotionDto>(entity);
        }

        public async Task<PromotionDto> CreateAsync(CreatePromotionDto dto)
        {
            var entity = _mapper.Map<Promotion>(dto);
            await _unitOfWork.Repository<Promotion>().AddAsync(entity);
            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<PromotionDto>(entity);
        }

        public async Task<PromotionDto> UpdateAsync(Guid id, UpdatePromotionDto dto)
        {
            var repo = _unitOfWork.Repository<Promotion>();
            var entity = await repo.GetByIdAsync(id);
            if (entity == null) throw new Exception("Promotion not found");

            _mapper.Map(dto, entity);
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
