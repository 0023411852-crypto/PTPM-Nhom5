using CloudService.Application.DTOs.Users;
using CloudService.Application.Interfaces;
using CloudService.Application.Services;
using CloudService.Domain.Entities;
using CloudService.Domain.Exceptions;
using CloudService.Domain.Interfaces;
using FluentAssertions;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using AutoMapper;
using CloudService.Domain.Events;

namespace CloudService.Tests
{
    public class UserServiceTests
    {
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<IEventDispatcher> _eventDispatcherMock;
        private readonly UserService _userService;
        private readonly Mock<IGenericRepository<AppUser>> _userRepoMock;

        public UserServiceTests()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _mapperMock = new Mock<IMapper>();
            _eventDispatcherMock = new Mock<IEventDispatcher>();

            _userRepoMock = new Mock<IGenericRepository<AppUser>>();
            _unitOfWorkMock.Setup(u => u.Repository<AppUser>()).Returns(_userRepoMock.Object);

            _userService = new UserService(_unitOfWorkMock.Object, _mapperMock.Object, _eventDispatcherMock.Object);
        }

        [Fact]
        public async Task GetUserByIdAsync_ShouldThrowNotFound_WhenUserDoesNotExist()
        {
            var userId = Guid.NewGuid();
            _userRepoMock.Setup(r => r.GetByIdAsync(userId)).ReturnsAsync((AppUser?)null);

            Func<Task> act = async () => await _userService.GetUserByIdAsync(userId);

            await act.Should().ThrowAsync<NotFoundException>();
        }

        [Fact]
        public async Task ChangePasswordAsync_ShouldThrowUnauthorized_WhenOldPasswordIsWrong()
        {
            var userId = Guid.NewGuid();
            var user = new AppUser { Id = userId, PasswordHash = BCrypt.Net.BCrypt.HashPassword("correct") };
            _userRepoMock.Setup(r => r.GetByIdAsync(userId)).ReturnsAsync(user);

            var dto = new ChangePasswordDto { OldPassword = "wrong", NewPassword = "new" };

            Func<Task> act = async () => await _userService.ChangePasswordAsync(userId, dto);

            await act.Should().ThrowAsync<UnauthorizedException>().WithMessage("Current password is incorrect");
        }

        [Fact]
        public async Task ChangePasswordAsync_ShouldDispatchPasswordChangedEvent_WhenSuccess()
        {
            var userId = Guid.NewGuid();
            var user = new AppUser { Id = userId, PasswordHash = BCrypt.Net.BCrypt.HashPassword("correct") };
            _userRepoMock.Setup(r => r.GetByIdAsync(userId)).ReturnsAsync(user);

            var dto = new ChangePasswordDto { OldPassword = "correct", NewPassword = "new" };

            var result = await _userService.ChangePasswordAsync(userId, dto);

            result.Should().BeTrue();
            _eventDispatcherMock.Verify(d => d.DispatchAsync(It.Is<PasswordChangedEvent>(e => e.UserId == userId)), Times.Once);
        }

        [Fact]
        public async Task UpdateUserStatusAsync_ShouldThrowValidation_WhenAdminLocksHimself()
        {
            var adminId = Guid.NewGuid();
            var dto = new UpdateUserStatusDto { IsActive = false };

            Func<Task> act = async () => await _userService.UpdateUserStatusAsync(adminId, adminId, dto);

            await act.Should().ThrowAsync<ValidationException>().WithMessage("You cannot lock your own account.");
        }

        [Fact]
        public async Task UpdateUserStatusAsync_ShouldDispatchUserLockedEvent_WhenLockingUser()
        {
            var adminId = Guid.NewGuid();
            var targetUserId = Guid.NewGuid();
            var user = new AppUser { Id = targetUserId, IsActive = true };
            _userRepoMock.Setup(r => r.GetByIdAsync(targetUserId)).ReturnsAsync(user);

            var dto = new UpdateUserStatusDto { IsActive = false };

            var result = await _userService.UpdateUserStatusAsync(adminId, targetUserId, dto);

            result.Should().BeTrue();
            _eventDispatcherMock.Verify(d => d.DispatchAsync(It.Is<UserLockedEvent>(e => e.TargetUserId == targetUserId && e.AdminId == adminId)), Times.Once);
        }
        [Fact]
        public async Task UpdateProfileAsync_ShouldThrowNotFound_WhenUserDoesNotExist()
        {
            var userId = Guid.NewGuid();
            _userRepoMock.Setup(r => r.GetByIdAsync(userId)).ReturnsAsync((AppUser?)null);
            var dto = new UpdateProfileDto { FullName = "New Name" };

            Func<Task> act = async () => await _userService.UpdateProfileAsync(userId, dto);

            await act.Should().ThrowAsync<NotFoundException>();
        }

        [Fact]
        public async Task UpdateProfileAsync_ShouldReturnTrue_WhenSuccess()
        {
            var userId = Guid.NewGuid();
            var user = new AppUser { Id = userId, FullName = "Old Name" };
            _userRepoMock.Setup(r => r.GetByIdAsync(userId)).ReturnsAsync(user);
            var dto = new UpdateProfileDto { FullName = "New Name" };

            var result = await _userService.UpdateProfileAsync(userId, dto);

            result.Should().BeTrue();
            user.FullName.Should().Be("New Name");
        }
    }
}
