using AutoMapper;
using CloudService.Application.Common;
using CloudService.Application.DTOs.Users;
using CloudService.Application.Interfaces;
using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;

namespace CloudService.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public UserService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<PagedResponse<UserDto>> GetAllUsersAsync(PaginationFilter filter)
        {
            var repo = _unitOfWork.Repository<AppUser>();
            var allUsers = await repo.GetAllAsync();
            var roles = await _unitOfWork.Repository<Role>().GetAllAsync();

            var pagedData = allUsers
                .OrderByDescending(x => x.CreatedAt)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToList();

            var dtos = _mapper.Map<List<UserDto>>(pagedData);
            
            foreach(var dto in dtos)
            {
                var userEntity = pagedData.First(u => u.Id == dto.Id);
                var role = roles.FirstOrDefault(r => r.Id == userEntity.RoleId);
                if (role != null) dto.RoleName = role.Name;
            }

            return new PagedResponse<UserDto>(dtos, allUsers.Count(), filter.PageNumber, filter.PageSize);
        }

        public async Task<UserDto?> GetUserByIdAsync(Guid id)
        {
            var user = await _unitOfWork.Repository<AppUser>().GetByIdAsync(id);
            if (user == null) return null;

            var dto = _mapper.Map<UserDto>(user);
            var role = await _unitOfWork.Repository<Role>().GetByIdAsync(user.RoleId);
            if (role != null) dto.RoleName = role.Name;

            return dto;
        }

        public async Task<bool> UpdateProfileAsync(Guid userId, UpdateProfileDto dto)
        {
            var repo = _unitOfWork.Repository<AppUser>();
            var user = await repo.GetByIdAsync(userId);
            if (user == null) return false;

            user.FullName = dto.FullName;
            repo.Update(user);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ChangePasswordAsync(Guid userId, ChangePasswordDto dto)
        {
            var repo = _unitOfWork.Repository<AppUser>();
            var user = await repo.GetByIdAsync(userId);
            if (user == null) return false;

            if (!BCrypt.Net.BCrypt.Verify(dto.OldPassword, user.PasswordHash))
            {
                throw new Exception("Mật khẩu cũ không chính xác.");
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            repo.Update(user);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateUserStatusAsync(Guid adminId, Guid targetUserId, UpdateUserStatusDto dto)
        {
            if (adminId == targetUserId)
            {
                throw new Exception("Bạn không thể tự khóa tài khoản của chính mình.");
            }

            var repo = _unitOfWork.Repository<AppUser>();
            var user = await repo.GetByIdAsync(targetUserId);
            if (user == null) return false;

            user.IsActive = dto.IsActive;
            repo.Update(user);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
    }
}
