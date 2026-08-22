using AutoMapper;
using CloudService.Application.Common;
using CloudService.Application.DTOs.NewsArticles;
using CloudService.Application.Interfaces;
using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;

namespace CloudService.Application.Services
{
    public class NewsArticleService : INewsArticleService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public NewsArticleService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<PagedResponse<NewsArticleDto>> GetAllAsync(PaginationFilter filter, bool onlyPublished = false)
        {
            var repo = _unitOfWork.Repository<NewsArticle>();
            var allData = await repo.GetAllAsync("Author");
            
            if (onlyPublished)
            {
                allData = allData.Where(x => x.IsPublished);
            }

            var pagedData = allData
                .OrderByDescending(x => x.CreatedAt)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToList();

            var dtos = _mapper.Map<List<NewsArticleDto>>(pagedData);
            return new PagedResponse<NewsArticleDto>(dtos, allData.Count(), filter.PageNumber, filter.PageSize);
        }

        public async Task<NewsArticleDto?> GetByIdAsync(Guid id)
        {
            var repo = _unitOfWork.Repository<NewsArticle>();
            var entity = await repo.GetByIdAsync(id);
            if (entity == null) return null;
            return _mapper.Map<NewsArticleDto>(entity);
        }

        public async Task<NewsArticleDto> CreateAsync(Guid authorId, CreateNewsArticleDto dto)
        {
            var entity = _mapper.Map<NewsArticle>(dto);
            entity.AuthorId = authorId;
            await _unitOfWork.Repository<NewsArticle>().AddAsync(entity);
            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<NewsArticleDto>(entity);
        }

        public async Task<NewsArticleDto> UpdateAsync(Guid id, UpdateNewsArticleDto dto)
        {
            var repo = _unitOfWork.Repository<NewsArticle>();
            var entity = await repo.GetByIdAsync(id);
            if (entity == null) throw new Exception("Article not found");

            _mapper.Map(dto, entity);
            repo.Update(entity);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<NewsArticleDto>(entity);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var repo = _unitOfWork.Repository<NewsArticle>();
            var entity = await repo.GetByIdAsync(id);
            if (entity == null) return false;

            repo.Delete(entity);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
    }
}
