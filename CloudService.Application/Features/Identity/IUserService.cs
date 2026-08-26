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
        Task<bool> ScheduleDeleteUserAsync(Guid adminId, Guid targetUserId);
        Task<bool> CancelDeleteUserAsync(Guid adminId, Guid targetUserId);
        Task<bool> AssignRoleAsync(Guid adminId, Guid targetUserId, string roleName);
        Task<UserDto> CreateUserAsync(Guid adminId, CreateUserDto dto);
        Task<IEnumerable<object>> GetMyActivitiesAsync(Guid userId);
        Task<IEnumerable<object>> GetUserActivitiesAdminAsync(Guid targetUserId);
    }
}
