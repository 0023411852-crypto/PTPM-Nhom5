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

        [HttpGet("{id}/payment-qr")]
        public IActionResult GetPaymentQR(Guid id, [FromQuery] decimal amount)
        {
            // Format: BankTransfer|OrderId|Amount
            var paymentString = $"BANK|0123456789|{amount}|{id}";
            var base64Qr = _qrCodeService.GenerateQRCodeBase64(paymentString);
            return Ok(new { qrCode = base64Qr, paymentString });
        }
    }
}
