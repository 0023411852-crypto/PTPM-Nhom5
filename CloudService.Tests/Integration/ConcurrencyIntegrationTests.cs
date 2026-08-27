using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Xunit;
using CloudService.Infrastructure.Data;
using CloudService.Domain.Entities;
using CloudService.Domain.Enums;
using Testcontainers.MsSql;
using Microsoft.Extensions.Configuration;
using Moq;
using CloudService.Application.Services;
using CloudService.Infrastructure.Repositories;
using CloudService.Domain.Events;
using AutoMapper;
using CloudService.Application.DTOs.Orders;
using CloudService.Application.Interfaces;

namespace CloudService.Tests.Integration
{
    public class ConcurrencyIntegrationTests : IAsyncLifetime
    {
        private readonly MsSqlContainer _msSqlContainer;
        private ApplicationDbContext _dbContext;
        private string _connectionString;

        public ConcurrencyIntegrationTests()
        {
            _msSqlContainer = new MsSqlBuilder()
                .WithImage("mcr.microsoft.com/mssql/server:2022-latest")
                .Build();
        }

        public async Task InitializeAsync()
        {
            await _msSqlContainer.StartAsync();
            _connectionString = _msSqlContainer.GetConnectionString();

            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseSqlServer(_connectionString)
                .Options;

            _dbContext = new ApplicationDbContext(options);
            await _dbContext.Database.MigrateAsync();
        }

        public async Task DisposeAsync()
        {
            await _msSqlContainer.DisposeAsync();
        }

        [Fact]
        public async Task RefreshToken_ConcurrentRequests_ShouldNotThrowOrCorruptData()
        {
            // Arrange
            var user = new AppUser { Id = Guid.NewGuid(), Email = "test@test.com", FullName = "Test", PasswordHash = "hash", IsActive = true, RoleId = Guid.NewGuid() };
            var session = new UserSession
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                RefreshTokenHash = "old_hash", // In real scenario, it's hashed
                ExpiresAt = DateTime.UtcNow.AddDays(1),
                IsRevoked = false,
                LastActiveTimestamp = DateTime.UtcNow
            };

            _dbContext.AppUsers.Add(user);
            _dbContext.UserSessions.Add(session);
            await _dbContext.SaveChangesAsync();

            var unitOfWork = new UnitOfWork(_dbContext);
            var mockEventDispatcher = new Mock<IEventDispatcher>();
            var mockConfig = new Mock<IConfiguration>();

            var authService1 = new AuthService(unitOfWork, mockConfig.Object, mockEventDispatcher.Object);
            var authService2 = new AuthService(unitOfWork, mockConfig.Object, mockEventDispatcher.Object);

            var request = new CloudService.Application.DTOs.Auth.RefreshTokenRequest { RefreshToken = "old_hash" };

            // Act & Assert
            await Assert.ThrowsAnyAsync<Exception>(() => Task.WhenAll(
                authService1.RefreshTokenAsync(request),
                authService2.RefreshTokenAsync(request)
            ));
        }
    }
}
