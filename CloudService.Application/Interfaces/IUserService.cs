using CloudService.Application.Common;
using CloudService.Application.DTOs.Users;

namespace CloudService.Application.Interfaces
{
    public interface IUserService
    {
        Task<PagedResponse<UserDto>> GetAllUsersAsync(PaginationFilter filter);
        Task<UserDto?> GetUserByIdAsync(Guid id);
        Task<bool> UpdateProfileAsync(Guid userId, UpdateProfileDto dto);
        Task<bool> ChangePasswordAsync(Guid userId, ChangePasswordDto dto);
        Task<bool> UpdateUserStatusAsync(Guid adminId, Guid targetUserId, UpdateUserStatusDto dto);
    }
}
