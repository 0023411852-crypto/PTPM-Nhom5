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
            var allData = await repo.GetAllAsync();
            
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
            var entity = await repo.GetByIdAsync(id);
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
            var entity = await repo.GetByIdAsync(id);
            if (entity == null) throw new Exception("Plan not found");

            var catRepo = _unitOfWork.Repository<ServiceCategory>();
            if (await catRepo.GetByIdAsync(dto.CategoryId) == null)
            {
                throw new Exception("Category not found");
            }

            _mapper.Map(dto, entity);
            repo.Update(entity);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<ServicePlanDto>(entity);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var repo = _unitOfWork.Repository<ServicePlan>();
            var entity = await repo.GetByIdAsync(id);
            if (entity == null) return false;

            repo.Delete(entity);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
    }
}
