using AutoMapper;
using System.Text;
using CloudService.Application.Common;
using CloudService.Application.DTOs.Orders;
using CloudService.Application.Interfaces;
using CloudService.Domain.Entities;
using CloudService.Domain.Enums;
using CloudService.Domain.Interfaces;

namespace CloudService.Application.Services
{
    public class OrderService : IOrderService
    {
        private const decimal VatRate = 0.10m;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IEmailService _emailService;
        private readonly IEventDispatcher _eventDispatcher;

        public OrderService(IUnitOfWork unitOfWork, IMapper mapper, IEmailService emailService, IEventDispatcher eventDispatcher)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _emailService = emailService;
            _eventDispatcher = eventDispatcher;
        }

        public async Task<PagedResponse<OrderDto>> GetUserOrdersAsync(Guid userId, PaginationFilter filter)
        {
            var repo = _unitOfWork.Repository<OrderRequest>();
            var allData = await repo.GetAllAsync(); 
            var userOrders = allData.Where(x => x.UserId == userId).ToList();

            var pagedData = userOrders
                .OrderByDescending(x => x.OrderDate)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToList();

            var dtos = _mapper.Map<List<OrderDto>>(pagedData);
            return new PagedResponse<OrderDto>(dtos, userOrders.Count, filter.PageNumber, filter.PageSize);
        }

        public async Task<OrderDetailDto?> GetOrderDetailAsync(Guid orderId, Guid requesterId, bool isAdmin)
        {
            var repo = _unitOfWork.Repository<OrderRequest>();
            var orders = await repo.GetAllAsync(includeProperties: "ServicePlan,ServicePlan.Category,PlanPrice,Promotion");
            var order = orders.FirstOrDefault(item => item.Id == orderId);
            if (order == null || (!isAdmin && order.UserId != requesterId)) return null;

            return new OrderDetailDto
            {
                Id = order.Id,
                UserId = order.UserId,
                ServicePlanName = order.ServicePlan?.Name ?? string.Empty,
                ServicePlanDescription = order.ServicePlan?.Description ?? string.Empty,
                ServicePlanSpecifications = order.ServicePlan?.Specifications ?? "{}",
                CategoryName = order.ServicePlan?.Category?.Name ?? string.Empty,
                BillingCycle = order.PlanPrice?.BillingCycle ?? 0,
                Price = order.PlanPrice?.Price ?? 0,
                SetupFee = order.PlanPrice?.SetupFee ?? 0,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                OrderDate = order.OrderDate,
                CustomerNotes = order.CustomerNotes,
                AdminNotes = isAdmin ? order.AdminNotes : null,
                PromotionCode = order.Promotion?.Code,
                DiscountPercentage = order.Promotion?.DiscountPercentage
            };
        }

        public async Task<PagedResponse<OrderDto>> GetAllOrdersAsync(PaginationFilter filter)
        {
            var repo = _unitOfWork.Repository<OrderRequest>();
            var allData = await repo.GetAllAsync();

            var pagedData = allData
                .OrderByDescending(x => x.OrderDate)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToList();

            var dtos = _mapper.Map<List<OrderDto>>(pagedData);
            return new PagedResponse<OrderDto>(dtos, allData.Count(), filter.PageNumber, filter.PageSize);
        }

        public async Task<byte[]> ExportAllOrdersCsvAsync()
        {
            var repo = _unitOfWork.Repository<OrderRequest>();
            var orders = (await repo.GetAllAsync())
                .OrderByDescending(x => x.OrderDate)
                .ToList();

            var builder = new StringBuilder();
            builder.Append('\uFEFF');
            builder.AppendLine("Id,UserId,ServicePlanId,PlanPriceId,TotalAmount,Status,OrderDate");
            foreach (var order in orders)
            {
                builder.AppendLine(string.Join(",", new[]
                {
                    EscapeCsv(order.Id.ToString()),
                    EscapeCsv(order.UserId.ToString()),
                    EscapeCsv(order.ServicePlanId.ToString()),
                    EscapeCsv(order.PlanPriceId.ToString()),
                    EscapeCsv(order.TotalAmount.ToString(System.Globalization.CultureInfo.InvariantCulture)),
                    EscapeCsv(order.Status.ToString()),
                    EscapeCsv(order.OrderDate.ToString("O"))
                }));
            }

            return Encoding.UTF8.GetBytes(builder.ToString());
        }

        private static string EscapeCsv(string value)
        {
            if (value.Contains(',') || value.Contains('"') || value.Contains('\n') || value.Contains('\r'))
                return $"\"{value.Replace("\"", "\"\"")}\"";
            return value;
        }

        public async Task<OrderDto> CreateOrderAsync(Guid userId, CreateOrderDto dto)
        {
            var planRepo = _unitOfWork.Repository<ServicePlan>();
            var plan = await planRepo.GetByIdAsync(dto.ServicePlanId);
            if (plan == null) throw new Exception("Service Plan not found");

            var priceRepo = _unitOfWork.Repository<PlanPrice>();
            var planPrice = await priceRepo.GetByIdAsync(dto.PlanPriceId);
            if (planPrice == null) throw new Exception("Plan Price not found");
            if (planPrice.ServicePlanId != dto.ServicePlanId)
                throw new Exception("Plan Price does not belong to the selected Service Plan");

            var order = new OrderRequest
            {
                UserId = userId,
                ServicePlanId = dto.ServicePlanId,
                PlanPriceId = dto.PlanPriceId,
                // PromotionId được giữ trong DTO để tương thích nhưng không được áp dụng.
                PromotionId = null,
                CustomerNotes = dto.CustomerNotes,
                TotalAmount = CalculateTotal(planPrice),
                Status = OrderStatus.Pending,
                OrderDate = DateTime.UtcNow
            };

            await _unitOfWork.Repository<OrderRequest>().AddAsync(order);
            await _unitOfWork.SaveChangesAsync();

            // Lấy thông tin user để gửi mail
            var user = await _unitOfWork.Repository<AppUser>().GetByIdAsync(userId);
            if (user != null)
            {
                await _emailService.SendEmailAsync(user.Email, "Xác nhận đặt hàng thành công", 
                    $"Cảm ơn {user.FullName}, đơn hàng {order.Id} của bạn đã được khởi tạo. Tổng tiền: {order.TotalAmount}đ.\nChúng tôi sẽ duyệt đơn ngay khi nhận được thanh toán.");
            }

            await _eventDispatcher.DispatchAsync(new CloudService.Domain.Events.OrderPlacedEvent(userId, order.Id, order.TotalAmount));

            return _mapper.Map<OrderDto>(order);
        }

        public async Task<decimal?> GetPaymentAmountAsync(Guid orderId, Guid requesterId, bool isAdmin)
        {
            var order = await _unitOfWork.Repository<OrderRequest>().GetByIdAsync(orderId);
            if (order == null || (!isAdmin && order.UserId != requesterId))
                return null;

            return order.TotalAmount;
        }

        private static decimal CalculateTotal(PlanPrice planPrice)
        {
            var subtotal = planPrice.Price + planPrice.SetupFee;
            return Math.Round(subtotal * (1 + VatRate), 2, MidpointRounding.AwayFromZero);
        }

        public async Task<DemoPaymentResultDto?> ConfirmDemoPaymentAsync(Guid orderId, Guid requesterId)
        {
            var orderRepo = _unitOfWork.Repository<OrderRequest>();
            var orders = await orderRepo.GetAllAsync(includeProperties: "ServicePlan");
            var order = orders.FirstOrDefault(x => x.Id == orderId && x.UserId == requesterId);
            if (order == null || order.Status == OrderStatus.Cancelled)
                return null;

            var serviceRepo = _unitOfWork.Repository<CustomerService>();
            var existingService = (await serviceRepo.GetAllAsync())
                .FirstOrDefault(x => x.OrderId == order.Id);

            if (existingService != null)
            {
                return new DemoPaymentResultDto
                {
                    OrderId = order.Id,
                    Status = order.Status.ToString(),
                    AlreadyProcessed = true,
                    ServiceName = existingService.ServiceName,
                    VpsIP = existingService.VpsIP,
                    VpsUser = existingService.VpsUser,
                    VpsPassword = existingService.VpsPassword,
                    ExpiryDate = existingService.ExpiryDate
                };
            }

            order.Status = OrderStatus.Completed;
            orderRepo.Update(order);

            var newService = new CustomerService
            {
                OrderId = order.Id,
                CustomerId = order.UserId,
                ServiceName = order.ServicePlan?.Name ?? "Demo VPS",
                VpsIP = "203.0.113.10",
                VpsUser = "demo-user",
                VpsPassword = $"Demo-{order.Id.ToString("N")[..8]}",
                ExpiryDate = DateTime.UtcNow.AddMonths(1),
                Status = "Active"
            };

            await serviceRepo.AddAsync(newService);
            await _unitOfWork.SaveChangesAsync();

            return new DemoPaymentResultDto
            {
                OrderId = order.Id,
                Status = order.Status.ToString(),
                AlreadyProcessed = false,
                ServiceName = newService.ServiceName,
                VpsIP = newService.VpsIP,
                VpsUser = newService.VpsUser,
                VpsPassword = newService.VpsPassword,
                ExpiryDate = newService.ExpiryDate
            };
        }

        public async Task<bool> DeleteOrderAsync(Guid orderId)
        {
            var repo = _unitOfWork.Repository<OrderRequest>();
            var order = await repo.GetByIdAsync(orderId);
            if (order == null) return false;

            repo.Delete(order);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
    }
}
