using CloudService.Application.Common;
using CloudService.Application.DTOs.ServicePlans;

namespace CloudService.Application.Interfaces
{
    public interface IServicePlanService
    {
        Task<PagedResponse<ServicePlanDto>> GetAllAsync(PaginationFilter filter);
        Task<ServicePlanDto?> GetByIdAsync(Guid id);
        Task<ServicePlanDto> CreateAsync(CreateServicePlanDto dto);
        Task<ServicePlanDto> UpdateAsync(Guid id, UpdateServicePlanDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}
