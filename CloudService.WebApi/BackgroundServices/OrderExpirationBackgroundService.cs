using CloudService.Domain.Entities;
using CloudService.Domain.Enums;
using CloudService.Domain.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace CloudService.WebApi.BackgroundServices
{
    public class OrderExpirationBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<OrderExpirationBackgroundService> _logger;

        public OrderExpirationBackgroundService(IServiceProvider serviceProvider, ILogger<OrderExpirationBackgroundService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            // Đợi một chút khi start ứng dụng
            await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _serviceProvider.CreateScope();
                    var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
                    var orderRepo = unitOfWork.Repository<OrderRequest>();
                    
                    // Lấy các đơn hàng Pending đã quá 15 phút (900 giây)
                    var thresholdDate = DateTime.UtcNow.AddMinutes(-15);
                    const int batchSize = 100;
                    var totalExpired = 0;

                    while (!stoppingToken.IsCancellationRequested)
                    {
                        var ordersToExpire = await orderRepo.SelectToListAsync(q => q
                            .Where(o => o.Status == OrderStatus.Pending && o.OrderDate <= thresholdDate)
                            .OrderBy(o => o.OrderDate)
                            .Take(batchSize));

                        if (ordersToExpire.Count == 0)
                            break;

                        foreach (var order in ordersToExpire)
                        {
                            order.Status = OrderStatus.Failed;
                        }

                        await unitOfWork.SaveChangesAsync();
                        totalExpired += ordersToExpire.Count;
                    }

                    if (totalExpired > 0)
                    {
                        _logger.LogInformation(
                            "Expired {ExpiredCount} pending orders because they exceeded 15 minutes limit.",
                            totalExpired);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred executing order expiration background service.");
                }

                // Chạy mỗi 1 phút
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
        }
    }
}
