using CloudService.Application.Common;
using CloudService.Application.DTOs.StaticPages;

namespace CloudService.Application.Interfaces
{
    public interface IStaticPageService
    {
        Task<PagedResponse<StaticPageDto>> GetAllAsync(PaginationFilter filter, bool onlyPublished = false);
        Task<StaticPageDto?> GetByIdAsync(Guid id, bool onlyPublished = false);
        Task<StaticPageDto?> GetBySlugAsync(string slug, bool onlyPublished = true);
        Task<StaticPageDto> CreateAsync(Guid authorId, CreateStaticPageDto dto);
        Task<StaticPageDto> UpdateAsync(Guid id, UpdateStaticPageDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}
