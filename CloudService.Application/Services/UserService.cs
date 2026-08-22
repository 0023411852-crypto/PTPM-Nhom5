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
            if (user == null) throw new NotFoundException("Không tìm thấy người dùng");

            var dto = _mapper.Map<UserDto>(user);
            var role = await _unitOfWork.Repository<Role>().GetByIdAsync(user.RoleId);
            if (role != null) dto.RoleName = role.Name;

            return dto;
        }

        public async Task<bool> UpdateProfileAsync(Guid userId, UpdateProfileDto dto)
        {
            var repo = _unitOfWork.Repository<AppUser>();
            var user = await repo.GetByIdAsync(userId);
            if (user == null) throw new NotFoundException("Không tìm thấy người dùng");

            user.FullName = dto.FullName;
            repo.Update(user);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ChangePasswordAsync(Guid userId, ChangePasswordDto dto)
        {
            var repo = _unitOfWork.Repository<AppUser>();
            var user = await repo.GetByIdAsync(userId);
            if (user == null) throw new NotFoundException("Không tìm thấy người dùng");

            if (!BCrypt.Net.BCrypt.Verify(dto.OldPassword, user.PasswordHash))
            {
                throw new UnauthorizedException("Mật khẩu hiện tại không chính xác");
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
                throw new ValidationException("Bạn không thể khoá tài khoản của chính mình.");
            }

            var repo = _unitOfWork.Repository<AppUser>();
            var user = await repo.GetByIdAsync(targetUserId);
            if (user == null) throw new NotFoundException("Không tìm thấy người dùng");

            user.IsActive = dto.IsActive;
            repo.Update(user);
            await _unitOfWork.SaveChangesAsync();
            
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

        public async Task<bool> ScheduleDeleteUserAsync(Guid adminId, Guid targetUserId)
        {
            if (adminId == targetUserId)
            {
                throw new ValidationException("Bạn không thể xoá tài khoản của chính mình.");
            }

            var repo = _unitOfWork.Repository<AppUser>();
            var user = await repo.GetByIdAsync(targetUserId);
            if (user == null) throw new NotFoundException("Không tìm thấy người dùng");

            user.PendingDeletionAt = DateTime.UtcNow;
            user.IsActive = false; // Khoá tài khoản luôn khi chờ xoá
            repo.Update(user);
            await _unitOfWork.SaveChangesAsync();
            
            return true;
        }

        public async Task<bool> CancelDeleteUserAsync(Guid adminId, Guid targetUserId)
        {
            var repo = _unitOfWork.Repository<AppUser>();
            var user = await repo.GetByIdAsync(targetUserId);
            if (user == null) throw new NotFoundException("Không tìm thấy người dùng");

            user.PendingDeletionAt = null;
            user.IsActive = true; 
            repo.Update(user);
            await _unitOfWork.SaveChangesAsync();
            
            return true;
        }


        public async Task<bool> AssignRoleAsync(Guid adminId, Guid targetUserId, string roleName)
        {
            if (adminId == targetUserId)
            {
                throw new ValidationException("Bạn không thể thay đổi vai trò của chính mình.");
            }

            var repo = _unitOfWork.Repository<AppUser>();
            var user = await repo.GetByIdAsync(targetUserId);
            if (user == null) throw new NotFoundException("Không tìm thấy người dùng");

            var roleRepo = _unitOfWork.Repository<Role>();
            var allRoles = await roleRepo.GetAllAsync();
            var targetRole = allRoles.FirstOrDefault(r => r.Name.Equals(roleName, StringComparison.OrdinalIgnoreCase));
            
            if (targetRole == null) throw new NotFoundException("Không tìm thấy vai trò");

            user.RoleId = targetRole.Id;
            repo.Update(user);
            await _unitOfWork.SaveChangesAsync();
            
            return true;
        }
        public async Task<UserDto> CreateUserAsync(Guid adminId, CreateUserDto dto)
        {
            var userRepo = _unitOfWork.Repository<AppUser>();
            var allUsers = await userRepo.GetAllAsync();
            
            if (allUsers.Any(u => u.Email == dto.Email))
            {
                throw new ConflictException("Email đã tồn tại trong hệ thống");
            }

            var roleRepo = _unitOfWork.Repository<Role>();
            var roles = await roleRepo.GetAllAsync();
            var targetRole = roles.FirstOrDefault(r => r.Name.Equals(dto.RoleName, StringComparison.OrdinalIgnoreCase));

            if (targetRole == null)
            {
                targetRole = roles.FirstOrDefault(r => r.Name == "Customer");
            }

            var newUser = new AppUser
            {
                Email = dto.Email,
                FullName = dto.FullName,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                RoleId = targetRole!.Id,
                IsActive = true
            };

            await userRepo.AddAsync(newUser);
            await _unitOfWork.SaveChangesAsync();

            var resultDto = _mapper.Map<UserDto>(newUser);
            resultDto.RoleName = targetRole.Name;

            return resultDto;
        }

        public async Task<IEnumerable<object>> GetMyActivitiesAsync(Guid userId)
        {
            var repo = _unitOfWork.Repository<AuditLog>();
            var allLogs = await repo.GetAllAsync();
            var myLogs = allLogs.Where(x => x.UserId == userId)
                                .OrderByDescending(x => x.Timestamp)
                                .Take(5)
                                .Select(x => new {
                                    x.Id,
                                    x.Action,
                                    x.Details,
                                    x.Timestamp
                                })
                                .ToList();
            return myLogs;
        }

        public async Task<IEnumerable<object>> GetUserActivitiesAdminAsync(Guid targetUserId)
        {
            var repo = _unitOfWork.Repository<AuditLog>();
            var allLogs = await repo.GetAllAsync();
            var logs = allLogs.Where(x => x.UserId == targetUserId)
                                .OrderByDescending(x => x.Timestamp)
                                .Take(20) // Show up to 20 for Admin
                                .Select(x => new {
                                    x.Id,
                                    x.Action,
                                    x.Details,
                                    x.Timestamp
                                })
                                .ToList();
            return logs;
        }
    }
}
