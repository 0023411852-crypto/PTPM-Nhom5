using AutoMapper;
using CloudService.Application.Common;
using CloudService.Application.DTOs.StaticPages;
using CloudService.Application.Interfaces;
using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;

namespace CloudService.Application.Services
{
    public class StaticPageService : IStaticPageService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public StaticPageService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<PagedResponse<StaticPageDto>> GetAllAsync(PaginationFilter filter, bool onlyPublished = false)
        {
            var repo = _unitOfWork.Repository<StaticPage>();
            var allData = await repo.GetAllAsync();
            
            if (onlyPublished)
            {
                allData = allData.Where(x => x.IsPublished);
            }

            var pagedData = allData
                .OrderByDescending(x => x.CreatedAt)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToList();

            var dtos = _mapper.Map<List<StaticPageDto>>(pagedData);
            return new PagedResponse<StaticPageDto>(dtos, allData.Count(), filter.PageNumber, filter.PageSize);
        }

        public async Task<StaticPageDto?> GetByIdAsync(Guid id)
        {
            var repo = _unitOfWork.Repository<StaticPage>();
            var entity = await repo.GetByIdAsync(id);
            if (entity == null) return null;
            return _mapper.Map<StaticPageDto>(entity);
        }

        public async Task<StaticPageDto?> GetBySlugAsync(string slug)
        {
            var repo = _unitOfWork.Repository<StaticPage>();
            var allData = await repo.GetAllAsync();
            var entity = allData.FirstOrDefault(x => x.Slug.ToLower() == slug.ToLower() && x.IsPublished);
            if (entity == null) return null;
            return _mapper.Map<StaticPageDto>(entity);
        }

        public async Task<StaticPageDto> CreateAsync(Guid authorId, CreateStaticPageDto dto)
        {
            var entity = _mapper.Map<StaticPage>(dto);
            entity.AuthorId = authorId;
            await _unitOfWork.Repository<StaticPage>().AddAsync(entity);
            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<StaticPageDto>(entity);
        }

        public async Task<StaticPageDto> UpdateAsync(Guid id, UpdateStaticPageDto dto)
        {
            var repo = _unitOfWork.Repository<StaticPage>();
            var entity = await repo.GetByIdAsync(id);
            if (entity == null) throw new Exception("Static page not found");

            _mapper.Map(dto, entity);
            repo.Update(entity);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<StaticPageDto>(entity);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var repo = _unitOfWork.Repository<StaticPage>();
            var entity = await repo.GetByIdAsync(id);
            if (entity == null) return false;

            repo.Delete(entity);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
    }
}
