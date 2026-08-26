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
                    
                    var thresholdDate = DateTime.UtcNow.AddDays(-3);
                    const int batchSize = 500;
                    var totalDeleted = 0;

                    while (!stoppingToken.IsCancellationRequested)
                    {
                        var usersToDelete = await userRepo.ToListAsync(query => query
                            .Where(u => u.PendingDeletionAt.HasValue && u.PendingDeletionAt.Value <= thresholdDate)
                            .OrderBy(u => u.PendingDeletionAt)
                            .Take(batchSize));

                        if (usersToDelete.Count == 0)
                            break;

                        foreach (var user in usersToDelete)
                        {
                            userRepo.Delete(user);
                        }

                        await unitOfWork.SaveChangesAsync();
                        totalDeleted += usersToDelete.Count;
                    }

                    if (totalDeleted > 0)
                    {
                        _logger.LogInformation(
                            "Deleted {DeletedCount} users due to pending deletion expiration.",
                            totalDeleted);
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
