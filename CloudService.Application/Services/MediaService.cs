using AutoMapper;
using CloudService.Application.Common;
using CloudService.Application.DTOs.Media;
using CloudService.Application.Interfaces;
using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace CloudService.Application.Services
{
    public class MediaService : IMediaService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public MediaService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<PagedResponse<MediaFileDto>> GetMediaFilesAsync(PaginationFilter filter, string? fileType, string? search)
        {
            var repo = _unitOfWork.Repository<MediaFile>();
            var allData = await repo.GetAllAsync();

            if (!string.IsNullOrEmpty(fileType) && fileType != "Loại tệp: Tất cả" && fileType != "Tất cả")
            {
                allData = allData.Where(m => m.FileType == fileType);
            }

            if (!string.IsNullOrEmpty(search))
            {
                allData = allData.Where(m => m.FileName.Contains(search, StringComparison.OrdinalIgnoreCase));
            }

            var totalCount = allData.Count();

            var pagedData = allData
                .OrderByDescending(m => m.CreatedAt)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToList();

            var mappedItems = _mapper.Map<System.Collections.Generic.List<MediaFileDto>>(pagedData);

            return new PagedResponse<MediaFileDto>(mappedItems, totalCount, filter.PageNumber, filter.PageSize);
        }

        public async Task<MediaFileDto> AddMediaFileAsync(string fileName, string fileUrl, string fileSize, string fileType)
        {
            var media = new MediaFile
            {
                FileName = fileName,
                FileUrl = fileUrl,
                FileSize = fileSize,
                FileType = fileType,
                CreatedAt = DateTime.UtcNow
            };

            await _unitOfWork.Repository<MediaFile>().AddAsync(media);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<MediaFileDto>(media);
        }

        public async Task<bool> DeleteMediaFileAsync(Guid id)
        {
            var repo = _unitOfWork.Repository<MediaFile>();
            var media = await repo.GetByIdAsync(id);
            if (media == null)
                return false;

            repo.Delete(media);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
    }
}
