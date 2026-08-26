using CloudService.Application.Common;
using CloudService.Application.DTOs.StaticPages;

namespace CloudService.Application.Interfaces
{
    public interface IStaticPageService
    {
        Task<PagedResponse<StaticPageDto>> GetAllAsync(PaginationFilter filter, bool onlyPublished = false);
        Task<StaticPageDto?> GetByIdAsync(Guid id);
        Task<StaticPageDto?> GetBySlugAsync(string slug);
        Task<StaticPageDto> CreateAsync(Guid authorId, CreateStaticPageDto dto);
        Task<StaticPageDto> UpdateAsync(Guid id, UpdateStaticPageDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}
