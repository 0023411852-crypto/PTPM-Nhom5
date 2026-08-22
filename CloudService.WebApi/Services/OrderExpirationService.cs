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

            var allOrders = await orderRepo.GetAllAsync();
            var expiredOrders = allOrders
                .Where(o => o.Status == OrderStatus.Pending && o.OrderDate < expirationTime)
                .ToList();

            if (expiredOrders.Any())
            {
                _logger.LogInformation($"Found {expiredOrders.Count} expired orders to cancel.");

                foreach (var order in expiredOrders)
                {
                    order.Status = OrderStatus.Cancelled;
                    order.CustomerNotes = (order.CustomerNotes ?? "") + " [Hệ thống tự động huỷ do quá 24h không thanh toán]";
                    orderRepo.Update(order);
                }

                await unitOfWork.SaveChangesAsync();
                _logger.LogInformation($"Successfully cancelled {expiredOrders.Count} expired orders.");
            }
        }
    }
}
