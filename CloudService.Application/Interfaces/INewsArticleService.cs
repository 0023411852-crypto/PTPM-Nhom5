using CloudService.Application.Common;
using CloudService.Application.DTOs.NewsArticles;

namespace CloudService.Application.Interfaces
{
    public interface INewsArticleService
    {
        Task<PagedResponse<NewsArticleDto>> GetAllAsync(PaginationFilter filter, bool onlyPublished = false, string search = "");
        Task<NewsArticleDto?> GetByIdAsync(Guid id, bool onlyPublished = false);
        Task<NewsArticleDto> CreateAsync(Guid authorId, CreateNewsArticleDto dto);
        Task<NewsArticleDto> UpdateAsync(Guid id, UpdateNewsArticleDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}
