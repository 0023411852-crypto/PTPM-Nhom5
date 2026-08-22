using CloudService.Application.Common;
using CloudService.Application.DTOs.AffiliateApplications;

namespace CloudService.Application.Interfaces
{
    public interface IAffiliateApplicationService
    {
        Task<PagedResponse<AffiliateApplicationDto>> GetAllAsync(PaginationFilter filter);
        Task<AffiliateApplicationDto?> GetByUserIdAsync(Guid userId);
        Task<AffiliateApplicationDto> CreateAsync(Guid userId, CreateAffiliateApplicationDto dto);
        Task<AffiliateApplicationDto> UpdateStatusAsync(Guid id, UpdateAffiliateApplicationDto dto);
    }
}
