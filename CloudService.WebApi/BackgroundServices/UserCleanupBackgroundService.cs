using CloudService.Application.Interfaces;
using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace CloudService.WebApi.BackgroundServices
{
    public class UserCleanupBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<UserCleanupBackgroundService> _logger;

        public UserCleanupBackgroundService(IServiceProvider serviceProvider, ILogger<UserCleanupBackgroundService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _serviceProvider.CreateScope();
                    var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
                    var userRepo = unitOfWork.Repository<AppUser>();
                    
                    var allUsers = await userRepo.GetAllAsync();
                    var thresholdDate = DateTime.UtcNow.AddDays(-3);

                    var usersToDelete = allUsers.Where(u => u.PendingDeletionAt.HasValue && u.PendingDeletionAt.Value <= thresholdDate).ToList();

                    if (usersToDelete.Any())
                    {
                        foreach (var user in usersToDelete)
                        {
                            userRepo.Delete(user);
                            _logger.LogInformation($"Deleted user {user.Id} due to pending deletion expiration.");
                        }
                        
                        await unitOfWork.SaveChangesAsync();
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred executing user cleanup background service.");
                }

                // Chạy mỗi giờ 1 lần
                await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
            }
        }
    }
}
