using AutoMapper;
using CloudService.Application.Common;
using CloudService.Application.DTOs.ServiceCategories;
using CloudService.Application.Interfaces;
using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;

namespace CloudService.Application.Services
{
    public class ServiceCategoryService : IServiceCategoryService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ServiceCategoryService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<PagedResponse<ServiceCategoryDto>> GetAllAsync(PaginationFilter filter)
        {
            var repo = _unitOfWork.Repository<ServiceCategory>();
            var allData = await repo.GetAllAsync();
            
            var pagedData = allData
                .OrderByDescending(x => x.CreatedAt)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToList();

            var dtos = _mapper.Map<List<ServiceCategoryDto>>(pagedData);
            return new PagedResponse<ServiceCategoryDto>(dtos, allData.Count(), filter.PageNumber, filter.PageSize);
        }

        public async Task<ServiceCategoryDto?> GetByIdAsync(Guid id)
        {
            var repo = _unitOfWork.Repository<ServiceCategory>();
            var entity = await repo.GetByIdAsync(id);
            if (entity == null) return null;
            return _mapper.Map<ServiceCategoryDto>(entity);
        }

        public async Task<ServiceCategoryDto> CreateAsync(CreateServiceCategoryDto dto)
        {
            var entity = _mapper.Map<ServiceCategory>(dto);
            await _unitOfWork.Repository<ServiceCategory>().AddAsync(entity);
            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<ServiceCategoryDto>(entity);
        }

        public async Task<ServiceCategoryDto> UpdateAsync(Guid id, UpdateServiceCategoryDto dto)
        {
            var repo = _unitOfWork.Repository<ServiceCategory>();
            var entity = await repo.GetByIdAsync(id);
            if (entity == null) throw new Exception("Category not found");

            _mapper.Map(dto, entity);
            repo.Update(entity);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<ServiceCategoryDto>(entity);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var repo = _unitOfWork.Repository<ServiceCategory>();
            var entity = await repo.GetByIdAsync(id);
            if (entity == null) return false;

            repo.Delete(entity);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
    }
}
