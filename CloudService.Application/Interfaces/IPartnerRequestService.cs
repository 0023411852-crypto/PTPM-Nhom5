using CloudService.Application.Common;
using CloudService.Application.DTOs.PartnerRequests;
using System;
using System.Threading.Tasks;

namespace CloudService.Application.Interfaces
{
    public interface IPartnerRequestService
    {
        Task<PartnerRequestDto> CreateAsync(CreatePartnerRequestDto dto);
        Task<PagedResponse<PartnerRequestDto>> GetAllAsync(PaginationFilter filter, string search = "", string status = "");
        Task<PartnerRequestDto> UpdateStatusAsync(Guid id, UpdatePartnerRequestStatusDto dto);
    }
}
