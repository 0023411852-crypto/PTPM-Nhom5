using CloudService.Application.Common;
using CloudService.Application.DTOs.ServiceCategories;

namespace CloudService.Application.Interfaces
{
    public interface IServiceCategoryService
    {
        Task<PagedResponse<ServiceCategoryDto>> GetAllAsync(PaginationFilter filter);
        Task<ServiceCategoryDto?> GetByIdAsync(Guid id);
        Task<ServiceCategoryDto> CreateAsync(CreateServiceCategoryDto dto);
        Task<ServiceCategoryDto> UpdateAsync(Guid id, UpdateServiceCategoryDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}
