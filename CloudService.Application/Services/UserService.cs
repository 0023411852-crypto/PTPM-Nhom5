using AutoMapper;
using CloudService.Application.Common;
using CloudService.Application.DTOs.Users;
using CloudService.Application.Interfaces;
using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;
using CloudService.Domain.Exceptions;
using CloudService.Domain.Events;

namespace CloudService.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IEventDispatcher _eventDispatcher;

        public UserService(IUnitOfWork unitOfWork, IMapper mapper, IEventDispatcher eventDispatcher)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _eventDispatcher = eventDispatcher;
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
            if (user == null) throw new NotFoundException("User not found");

            var dto = _mapper.Map<UserDto>(user);
            var role = await _unitOfWork.Repository<Role>().GetByIdAsync(user.RoleId);
            if (role != null) dto.RoleName = role.Name;

            return dto;
        }

        public async Task<bool> UpdateProfileAsync(Guid userId, UpdateProfileDto dto)
        {
            var repo = _unitOfWork.Repository<AppUser>();
            var user = await repo.GetByIdAsync(userId);
            if (user == null) throw new NotFoundException("User not found");

            user.FullName = dto.FullName;
            repo.Update(user);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ChangePasswordAsync(Guid userId, ChangePasswordDto dto)
        {
            var repo = _unitOfWork.Repository<AppUser>();
            var user = await repo.GetByIdAsync(userId);
            if (user == null) throw new NotFoundException("User not found");

            if (!BCrypt.Net.BCrypt.Verify(dto.OldPassword, user.PasswordHash))
            {
                throw new UnauthorizedException("Current password is incorrect");
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            repo.Update(user);
            
            await _eventDispatcher.DispatchAsync(new PasswordChangedEvent 
            { 
                UserId = userId,
                IPAddress = "" // IP will be injected via context accessor in a real app
            });
            
            return true;
        }

        public async Task<bool> UpdateUserStatusAsync(Guid adminId, Guid targetUserId, UpdateUserStatusDto dto)
        {
            if (adminId == targetUserId)
            {
                throw new ValidationException("You cannot lock your own account.");
            }

            var repo = _unitOfWork.Repository<AppUser>();
            var user = await repo.GetByIdAsync(targetUserId);
            if (user == null) throw new NotFoundException("User not found");

            user.IsActive = dto.IsActive;
            repo.Update(user);
            
            if (!dto.IsActive)
            {
                await _eventDispatcher.DispatchAsync(new UserLockedEvent 
                { 
                    TargetUserId = targetUserId,
                    AdminId = adminId
                });
            }
            
            return true;
        }


    }
}
