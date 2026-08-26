using AutoMapper;
using System.Text;
using CloudService.Application.Common;
using CloudService.Application.DTOs.Orders;
using CloudService.Application.Interfaces;
using CloudService.Domain.Entities;
using CloudService.Domain.Enums;
using CloudService.Domain.Interfaces;
using CloudService.Domain.Exceptions;
using Microsoft.Extensions.Configuration;
namespace CloudService.Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IEmailService _emailService;
        private readonly IEventDispatcher _eventDispatcher;
        private readonly Microsoft.Extensions.Configuration.IConfiguration _configuration;

        public OrderService(IUnitOfWork unitOfWork, IMapper mapper, IEmailService emailService, IEventDispatcher eventDispatcher, Microsoft.Extensions.Configuration.IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _emailService = emailService;
            _eventDispatcher = eventDispatcher;
            _configuration = configuration;
        }

        public async Task<PagedResponse<OrderDto>> GetUserOrdersAsync(Guid userId, PaginationFilter filter)
        {
            var repo = _unitOfWork.Repository<OrderRequest>();
            var totalRecords = await repo.CountAsync(query => query.Where(x => x.UserId == userId));
            var pagedData = await repo.ToListAsync(query => query
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.OrderDate)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize));

            var dtos = _mapper.Map<List<OrderDto>>(pagedData);

            if (dtos.Any())
            {
                var orderIds = dtos.Select(d => d.Id).ToList();
                var reviewRepo = _unitOfWork.Repository<CustomerReview>();
                var reviewedOrderIds = reviewRepo.GetQueryable()
                    .Where(r => r.OrderId.HasValue && orderIds.Contains(r.OrderId.Value))
                    .Select(r => r.OrderId!.Value)
                    .ToList();

                foreach (var dto in dtos)
                {
                    dto.IsReviewed = reviewedOrderIds.Contains(dto.Id);
                }
            }

            return new PagedResponse<OrderDto>(dtos, totalRecords, filter.PageNumber, filter.PageSize);
        }

        public async Task<OrderDetailDto?> GetOrderDetailAsync(Guid orderId, Guid requesterId, bool isAdmin)
        {
            var repo = _unitOfWork.Repository<OrderRequest>();
            var order = await repo.FirstOrDefaultAsync(
                item => item.Id == orderId && (isAdmin || item.UserId == requesterId),
                includeProperties: "ServicePlan,ServicePlan.Category,PlanPrice,Promotion");
            if (order == null) return null;

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
            var totalRecords = await repo.CountAsync(query => query);
            var pagedData = await repo.ToListAsync(query => query
                .OrderByDescending(x => x.OrderDate)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize));

            var dtos = _mapper.Map<List<OrderDto>>(pagedData);
            return new PagedResponse<OrderDto>(dtos, totalRecords, filter.PageNumber, filter.PageSize);
        }

        public async Task<byte[]> ExportAllOrdersCsvAsync()
        {
            var repo = _unitOfWork.Repository<OrderRequest>();
            var orders = await repo.ToListAsync(query => query
                .OrderByDescending(x => x.OrderDate));

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
            if (plan == null) throw new NotFoundException("Service Plan not found");

            var priceRepo = _unitOfWork.Repository<PlanPrice>();
            var planPrice = await priceRepo.GetByIdAsync(dto.PlanPriceId);
            if (planPrice == null) throw new NotFoundException("Plan Price not found");
            if (planPrice.ServicePlanId != dto.ServicePlanId)
                throw new ValidationException("Plan Price does not belong to the selected Service Plan");

            // Validate and apply promotion if provided
            Promotion? promotion = null;
            decimal discountAmount = 0;
            if (dto.PromotionId.HasValue)
            {
                var promoRepo = _unitOfWork.Repository<Promotion>();
                promotion = await promoRepo.GetByIdAsync(dto.PromotionId.Value, includeProperties: "ServicePlans");
                
                if (promotion == null)
                    throw new NotFoundException("Promotion not found");
                
                if (!promotion.IsActive)
                    throw new ValidationException("Promotion is not active");
                
                if (promotion.EndDate.HasValue && promotion.EndDate < DateTime.UtcNow)
                    throw new ValidationException("Promotion has expired");
                
                if (promotion.StartDate > DateTime.UtcNow)
                    throw new ValidationException("Promotion has not started yet");
                
                // Check if promotion applies to this plan
                if (promotion.ServicePlans != null && promotion.ServicePlans.Any())
                {
                    if (!promotion.ServicePlans.Any(p => p.Id == dto.ServicePlanId))
                        throw new ValidationException("Promotion does not apply to this service plan");
                }

                // Calculate discount
                var subtotal = planPrice.Price + planPrice.SetupFee;
                discountAmount = Math.Round(subtotal * (promotion.DiscountPercentage / 100), 2);
                
                // Ensure discount doesn't exceed total
                if (discountAmount > subtotal)
                    discountAmount = subtotal;
            }

            var totalAmount = CalculateTotal(planPrice) - discountAmount;

            var order = new OrderRequest
            {
                UserId = userId,
                ServicePlanId = dto.ServicePlanId,
                PlanPriceId = dto.PlanPriceId,
                PromotionId = dto.PromotionId,
                CustomerNotes = dto.CustomerNotes,
                TotalAmount = totalAmount,
                Status = OrderStatus.Pending,
                OrderDate = DateTime.UtcNow
            };

            await _unitOfWork.Repository<OrderRequest>().AddAsync(order);
            await _unitOfWork.SaveChangesAsync();

            // Lấy thông tin user để gửi mail
            var user = await _unitOfWork.Repository<AppUser>().GetByIdAsync(userId);
            if (user != null)
            {
                var discountText = discountAmount > 0 ? $" (Giảm giá: {discountAmount}đ)" : "";
                await _emailService.SendEmailAsync(user.Email, "Xác nhận đặt hàng thành công", 
                    $"Cảm ơn {user.FullName}, đơn hàng {order.Id} của bạn đã được khởi tạo. Tổng tiền: {order.TotalAmount}đ{discountText}.\nHệ thống sẽ tự động hoàn tất đơn hàng và khởi tạo dịch vụ ngay khi nhận được thanh toán.");
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
            return Math.Round(subtotal, 2, MidpointRounding.AwayFromZero);
        }

        public async Task<DemoPaymentResultDto?> ConfirmDemoPaymentAsync(Guid orderId, Guid requesterId)
        {
            if (!bool.TryParse(_configuration["DemoPayment:Enabled"], out var isEnabled) || !isEnabled)
                throw new UnauthorizedException("Demo Payment đang bị tắt trên hệ thống.");

            var orderRepo = _unitOfWork.Repository<OrderRequest>();
            var order = await orderRepo.FirstOrDefaultAsync(
                x => x.Id == orderId && x.UserId == requesterId,
                includeProperties: "ServicePlan");
            if (order == null || order.Status == OrderStatus.Cancelled)
                return null;

            // Check if order is already completed
            if (order.Status == OrderStatus.Completed)
            {
                var existingServiceRepo = _unitOfWork.Repository<CustomerService>();
                var existingService = await existingServiceRepo.FirstOrDefaultAsync(
                    x => x.OrderId == order.Id);

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
                        VpsPassword = "********", // Masked for security
                        ExpiryDate = existingService.ExpiryDate
                    };
                }
            }

            await using var transaction = await _unitOfWork.BeginTransactionAsync();
            try
            {
                order.Status = OrderStatus.Completed;
                orderRepo.Update(order);

                var serviceRepo = _unitOfWork.Repository<CustomerService>();

            // Generate demo credentials (randomized for demo environment)
            var random = new Random();
            var demoIp = $"10.{random.Next(0, 255)}.{random.Next(0, 255)}.{random.Next(10, 254)}";
            var demoUser = $"demo-{order.Id.ToString("N")[..8]}";
            var demoPassword = GenerateRandomPassword();

            var newService = new CustomerService
            {
                OrderId = order.Id,
                CustomerId = order.UserId,
                ServiceName = order.ServicePlan?.Name ?? "Demo VPS",
                VpsIP = demoIp,
                VpsUser = demoUser,
                VpsPassword = demoPassword,
                ExpiryDate = DateTime.UtcNow.AddMonths(1),
                Status = "Active"
            };

                await serviceRepo.AddAsync(newService);
                await _unitOfWork.SaveChangesAsync();
                await transaction.CommitAsync();

                return new DemoPaymentResultDto
            {
                OrderId = order.Id,
                Status = order.Status.ToString(),
                AlreadyProcessed = false,
                ServiceName = newService.ServiceName,
                VpsIP = newService.VpsIP,
                VpsUser = newService.VpsUser,
                VpsPassword = "********", // Masked for security
                    ExpiryDate = newService.ExpiryDate
                };
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        private static string GenerateRandomPassword(int length = 16)
        {
            const string chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
            var random = new Random();
            var result = new char[length];
            for (int i = 0; i < length; i++)
            {
                result[i] = chars[random.Next(chars.Length)];
            }
            return new string(result);
        }

        public async Task<bool> DeleteOrderAsync(Guid orderId, Guid requesterId, bool isAdmin)
        {
            var repo = _unitOfWork.Repository<OrderRequest>();
            var order = await repo.FirstOrDefaultAsync(
                x => x.Id == orderId && (isAdmin || x.UserId == requesterId));
            if (order == null) return false;

            repo.Delete(order);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
    }
}
