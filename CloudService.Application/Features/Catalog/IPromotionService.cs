using CloudService.Application.Common;
using CloudService.Application.DTOs.Promotions;

namespace CloudService.Application.Interfaces
{
    public interface IPromotionService
    {
        Task<PagedResponse<PromotionDto>> GetAllAsync(PaginationFilter filter, bool onlyActive = false);
        Task<PromotionDto?> GetByIdAsync(Guid id);
        Task<PromotionDto> CreateAsync(CreatePromotionDto dto);
        Task<PromotionDto> UpdateAsync(Guid id, UpdatePromotionDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}
