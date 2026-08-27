using CloudService.Application.Common;
using CloudService.Application.DTOs.Orders;
using CloudService.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CloudService.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly IQRCodeService _qrCodeService;
        private readonly IConfiguration _configuration;

        public OrdersController(IOrderService orderService, IQRCodeService qrCodeService, IConfiguration configuration)
        {
            _orderService = orderService;
            _qrCodeService = qrCodeService;
            _configuration = configuration;
        }

        [HttpGet("my-orders")]
        public async Task<IActionResult> GetMyOrders([FromQuery] PaginationFilter filter)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdStr, out var userId))
                return Unauthorized();

            var result = await _orderService.GetUserOrdersAsync(userId, filter);
            return Ok(result);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetOrderDetail(Guid id)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdStr, out var userId))
                return Unauthorized();

            var result = await _orderService.GetOrderDetailAsync(id, userId, User.IsInRole("Admin"));
            if (result == null)
                return NotFound(new { message = "Không tìm thấy đơn hàng hoặc bạn không có quyền xem." });

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdStr, out var userId))
                return Unauthorized();

            try
            {
                var result = await _orderService.CreateOrderAsync(userId, dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("batch")]
        public async Task<IActionResult> CreateOrderBatch([FromBody] CreateOrderBatchDto dto)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdStr, out var userId))
                return Unauthorized();

            try
            {
                var groupId = await _orderService.CreateOrderBatchAsync(userId, dto);
                return Ok(new { groupId });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllOrders([FromQuery] PaginationFilter filter)
        {
            var result = await _orderService.GetAllOrdersAsync(filter);
            return Ok(result);
        }

        [HttpGet("export")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ExportAllOrders()
        {
            var content = await _orderService.ExportAllOrdersCsvAsync();
            return File(content, "text/csv; charset=utf-8", $"orders-{DateTime.UtcNow:yyyyMMdd-HHmmss}.csv");
        }

        [HttpPost("{id:guid}/demo-payment")]
        public async Task<IActionResult> ConfirmDemoPayment(Guid id)
        {
            if (!_configuration.GetValue<bool>("DemoPayment:Enabled"))
                return NotFound(new { message = "Demo Payment đang bị tắt." });

            var userIdValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdValue, out var userId))
                return Unauthorized();

            var result = await _orderService.ConfirmDemoPaymentAsync(id, userId);
            if (result == null)
                return NotFound(new { message = "Không tìm thấy đơn hàng hoặc đơn không hợp lệ." });

            return Ok(result);
        }

        [HttpGet("{id:guid}/payment-qr")]
        public async Task<IActionResult> GetPaymentQR(Guid id, [FromQuery] decimal? amount = null)
        {
            var requesterIdValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(requesterIdValue, out var requesterId))
                return Unauthorized();

            // amount chỉ giữ để tương thích với FE cũ; không được dùng làm nguồn sự thật.
            var serverAmount = await _orderService.GetPaymentAmountAsync(id, requesterId, User.IsInRole("Admin"));
            if (serverAmount == null)
                return NotFound(new { message = "Không tìm thấy đơn hàng." });
            if (serverAmount <= 0)
                return BadRequest(new { message = "Tổng tiền đơn hàng không hợp lệ." });

            var paymentString = $"BANK|0123456789|{serverAmount.Value:0.##}|{id}";
            var base64Qr = _qrCodeService.GenerateQRCodeBase64(paymentString);
            return Ok(new { qrCode = base64Qr, paymentString, amount = serverAmount.Value });
        }

        [HttpPost("group/{groupId:guid}/demo-payment")]
        public async Task<IActionResult> ConfirmDemoPaymentGroup(Guid groupId)
        {
            if (!_configuration.GetValue<bool>("DemoPayment:Enabled"))
                return NotFound(new { message = "Demo Payment đang bị tắt." });

            var userIdValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdValue, out var userId))
                return Unauthorized();

            var result = await _orderService.ConfirmDemoPaymentGroupAsync(groupId, userId);
            if (result == null || !result.Any())
                return NotFound(new { message = "Không tìm thấy đơn hàng hoặc đơn không hợp lệ." });

            return Ok(result);
        }

        [HttpGet("group/{groupId:guid}/payment-qr")]
        public async Task<IActionResult> GetGroupPaymentQR(Guid groupId)
        {
            var requesterIdValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(requesterIdValue, out var requesterId))
                return Unauthorized();

            var serverAmount = await _orderService.GetPaymentAmountForGroupAsync(groupId, requesterId, User.IsInRole("Admin"));
            if (serverAmount == null)
                return NotFound(new { message = "Không tìm thấy nhóm đơn hàng." });
            if (serverAmount <= 0)
                return BadRequest(new { message = "Tổng tiền đơn hàng không hợp lệ." });

            var paymentString = $"BANK|0123456789|{serverAmount.Value:0.##}|{groupId}";
            var base64Qr = _qrCodeService.GenerateQRCodeBase64(paymentString);
            return Ok(new { qrCode = base64Qr, paymentString, amount = serverAmount.Value });
        }

        [HttpPost("seed")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SeedOrders()
        {
            var unitOfWork = HttpContext.RequestServices.GetService(typeof(CloudService.Domain.Interfaces.IUnitOfWork)) as CloudService.Domain.Interfaces.IUnitOfWork;
            if (unitOfWork == null) return BadRequest("UnitOfWork not available.");

            var userRepo = unitOfWork.Repository<CloudService.Domain.Entities.AppUser>();
            var planRepo = unitOfWork.Repository<CloudService.Domain.Entities.ServicePlan>();
            var priceRepo = unitOfWork.Repository<CloudService.Domain.Entities.PlanPrice>();
            var userIds = await userRepo.SelectToListAsync(query => query.Select(user => user.Id));
            var planIds = await planRepo.SelectToListAsync(query => query.Select(plan => plan.Id));
            var priceIds = await priceRepo.SelectToListAsync(query => query.Select(price => price.Id));

            if (userIds.Count == 0 || planIds.Count == 0 || priceIds.Count == 0)
                return BadRequest("Not enough data to seed orders. Ensure users, plans, and prices exist.");

            var random = new Random();
            for (int i = 0; i < 15; i++)
            {
                var userId = userIds[random.Next(userIds.Count)];
                var planId = planIds[random.Next(planIds.Count)];
                var price = await priceRepo.FirstOrDefaultAsync(price => price.ServicePlanId == planId)
                    ?? await priceRepo.GetByIdAsync(priceIds[random.Next(priceIds.Count)]);
                if (price == null)
                    continue;

                var order = new CloudService.Domain.Entities.OrderRequest
                {
                    UserId = userId,
                    ServicePlanId = planId,
                    PlanPriceId = price.Id,
                    TotalAmount = price.Price + price.SetupFee,
                    Status = random.Next(2) == 0 ? CloudService.Domain.Enums.OrderStatus.Completed : CloudService.Domain.Enums.OrderStatus.Pending,
                    OrderDate = DateTime.UtcNow.AddDays(-random.Next(0, 90))
                };
                await unitOfWork.Repository<CloudService.Domain.Entities.OrderRequest>().AddAsync(order);
            }
            await unitOfWork.SaveChangesAsync();
            return Ok(new { message = "Seeded 15 orders successfully" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteOrder(Guid id)
        {
            try
            {
                var requesterIdValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!Guid.TryParse(requesterIdValue, out var requesterId))
                    return Unauthorized();

                var result = await _orderService.DeleteOrderAsync(id, requesterId, User.IsInRole("Admin"));
                if (!result) return NotFound(new { message = "Order not found" });
                return Ok(new { message = "Order deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
