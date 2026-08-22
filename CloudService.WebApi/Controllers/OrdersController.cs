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

        public OrdersController(IOrderService orderService, IQRCodeService qrCodeService)
        {
            _orderService = orderService;
            _qrCodeService = qrCodeService;
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

        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllOrders([FromQuery] PaginationFilter filter)
        {
            var result = await _orderService.GetAllOrdersAsync(filter);
            return Ok(result);
        }

        [HttpPatch("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] string status)
        {
            var result = await _orderService.UpdateOrderStatusAsync(id, status);
            if (!result) return NotFound();
            return Ok(new { message = "Status updated successfully" });
        }

        [HttpPost("{id}/approve")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ApproveOrder(Guid id, [FromBody] ApproveOrderDto dto)
        {
            var result = await _orderService.ApproveOrderAsync(id, dto);
            if (!result) return BadRequest(new { message = "Could not approve order" });
            return Ok(new { message = "Order approved successfully" });
        }

        [HttpGet("{id}/payment-qr")]
        public IActionResult GetPaymentQR(Guid id, [FromQuery] decimal amount)
        {
            // Format: BankTransfer|OrderId|Amount
            var paymentString = $"BANK|0123456789|{amount}|{id}";
            var base64Qr = _qrCodeService.GenerateQRCodeBase64(paymentString);
            return Ok(new { qrCode = base64Qr, paymentString });
        }

        [HttpPost("admin-create")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AdminCreateOrder([FromBody] AdminCreateOrderDto dto)
        {
            try
            {
                var result = await _orderService.AdminCreateOrderAsync(dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("seed")]
        [AllowAnonymous]
        public async Task<IActionResult> SeedOrders()
        {
            var unitOfWork = HttpContext.RequestServices.GetService(typeof(CloudService.Domain.Interfaces.IUnitOfWork)) as CloudService.Domain.Interfaces.IUnitOfWork;
            if (unitOfWork == null) return BadRequest("UnitOfWork not available.");

            var users = await unitOfWork.Repository<CloudService.Domain.Entities.AppUser>().GetAllAsync();
            var plans = await unitOfWork.Repository<CloudService.Domain.Entities.ServicePlan>().GetAllAsync();
            var planPrices = await unitOfWork.Repository<CloudService.Domain.Entities.PlanPrice>().GetAllAsync();

            if (!users.Any() || !plans.Any() || !planPrices.Any())
                return BadRequest("Not enough data to seed orders. Ensure users, plans, and prices exist.");

            var random = new Random();
            for (int i = 0; i < 15; i++)
            {
                var user = users.ElementAt(random.Next(users.Count()));
                var plan = plans.ElementAt(random.Next(plans.Count()));
                var price = planPrices.Where(p => p.ServicePlanId == plan.Id).FirstOrDefault() 
                            ?? planPrices.ElementAt(random.Next(planPrices.Count()));

                var order = new CloudService.Domain.Entities.OrderRequest
                {
                    UserId = user.Id,
                    ServicePlanId = plan.Id,
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
                var result = await _orderService.DeleteOrderAsync(id);
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
