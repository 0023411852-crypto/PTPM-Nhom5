using CloudService.Domain.Entities;
using CloudService.Domain.Enums;
using CloudService.Domain.Interfaces;

namespace CloudService.WebApi.Services
{
    public class OrderExpirationService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<OrderExpirationService> _logger;
        private readonly TimeSpan _checkInterval = TimeSpan.FromMinutes(10); // Run every 10 minutes

        public OrderExpirationService(IServiceProvider serviceProvider, ILogger<OrderExpirationService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Order Expiration Service is starting.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await CheckAndExpireOrdersAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while executing Order Expiration Service.");
                }

                await Task.Delay(_checkInterval, stoppingToken);
            }

            _logger.LogInformation("Order Expiration Service is stopping.");
        }

        private async Task CheckAndExpireOrdersAsync(CancellationToken stoppingToken)
        {
            using var scope = _serviceProvider.CreateScope();
            var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
            var orderRepo = unitOfWork.Repository<OrderRequest>();

            var expirationTime = DateTime.UtcNow.AddHours(-24);

            const int batchSize = 500;
            var totalCancelled = 0;

            while (!stoppingToken.IsCancellationRequested)
            {
                var expiredOrders = await orderRepo.ToListAsync(query => query
                    .Where(o => o.Status == OrderStatus.Pending && o.OrderDate < expirationTime)
                    .OrderBy(o => o.OrderDate)
                    .Take(batchSize));

                if (expiredOrders.Count == 0)
                    break;

                foreach (var order in expiredOrders)
                {
                    order.Status = OrderStatus.Cancelled;
                    order.CustomerNotes = (order.CustomerNotes ?? "") + " [Hệ thống tự động huỷ do quá 24h không thanh toán]";
                    orderRepo.Update(order);
                }

                await unitOfWork.SaveChangesAsync();
                totalCancelled += expiredOrders.Count;

                _logger.LogInformation(
                    "Cancelled batch of {BatchCount} expired orders; total cancelled this run: {TotalCancelled}.",
                    expiredOrders.Count,
                    totalCancelled);
            }
        }
    }
}
