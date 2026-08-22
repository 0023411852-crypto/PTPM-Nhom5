using CloudService.Application.Common;
using CloudService.Application.DTOs.Media;
using System;
using System.Threading.Tasks;

namespace CloudService.Application.Interfaces
{
    public interface IMediaService
    {
        Task<PagedResponse<MediaFileDto>> GetMediaFilesAsync(PaginationFilter filter, string? fileType, string? search);
        Task<MediaFileDto> AddMediaFileAsync(string fileName, string fileUrl, string fileSize, string fileType);
        Task<bool> DeleteMediaFileAsync(Guid id);
    }
}
