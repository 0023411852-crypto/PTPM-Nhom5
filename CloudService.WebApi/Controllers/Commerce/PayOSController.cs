using CloudService.Application.Interfaces;
using CloudService.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace CloudService.WebApi.Controllers.Commerce
{
    [Route("api/[controller]")]
    [ApiController]
    public class PayOSController : ControllerBase
    {
        private readonly global::PayOS.PayOSClient _payOS;
        private readonly IOrderService _orderService;
        private readonly CloudService.Domain.Interfaces.IUnitOfWork _unitOfWork;

        public PayOSController(global::PayOS.PayOSClient payOS, IOrderService orderService, CloudService.Domain.Interfaces.IUnitOfWork unitOfWork)
        {
            _payOS = payOS;
            _orderService = orderService;
            _unitOfWork = unitOfWork;
        }

        [HttpPost("create-payment-link/{groupId:guid}")]
        [Authorize]
        public async Task<IActionResult> CreatePaymentLink(Guid groupId)
        {
            var requesterIdValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(requesterIdValue, out var requesterId))
                return Unauthorized();

            var serverAmount = await _orderService.GetPaymentAmountForGroupAsync(groupId, requesterId, User.IsInRole("Admin"));
            if (serverAmount == null)
                return NotFound(new { message = "Không tìm thấy nhóm đơn hàng." });
            if (serverAmount <= 0)
                return BadRequest(new { message = "Tổng tiền đơn hàng không hợp lệ." });

            var orderCode = long.Parse(DateTimeOffset.Now.ToString("yyMMddHHmmssfff"));
            
            var orderRepo = _unitOfWork.Repository<OrderRequest>();
            var orders = await orderRepo.SelectToListAsync(q => q.Where(o => o.OrderGroupId == groupId));
            var firstOrder = orders.FirstOrDefault();
            if (firstOrder == null)
                return BadRequest(new { message = "Đơn hàng trống." });

            firstOrder.AdminNotes = $"PAYOS_ORDERCODE: {orderCode}";
            await _unitOfWork.SaveChangesAsync();

            var frontendDomain = "http://20.196.66.74:3000";

            var paymentData = new global::PayOS.Models.V2.PaymentRequests.CreatePaymentLinkRequest
            {
                OrderCode = orderCode,
                Amount = (long)serverAmount.Value,
                Description = "Thanh toan CloudNova",
                Items = new List<global::PayOS.Models.V2.PaymentRequests.PaymentLinkItem> { 
                    new global::PayOS.Models.V2.PaymentRequests.PaymentLinkItem {
                        Name = "Dịch vụ Cloud",
                        Quantity = 1,
                        Price = (long)serverAmount.Value
                    }
                },
                CancelUrl = $"{frontendDomain}/checkout/cancel",
                ReturnUrl = $"{frontendDomain}/checkout/success"
            };

            try
            {
                var createPayment = await _payOS.PaymentRequests.CreateAsync(paymentData);
                return Ok(new { 
                    checkoutUrl = createPayment.CheckoutUrl,
                    qrCode = createPayment.QrCode,
                    bin = createPayment.Bin,
                    accountNumber = createPayment.AccountNumber,
                    accountName = createPayment.AccountName,
                    amount = createPayment.Amount,
                    description = createPayment.Description,
                    orderCode = createPayment.OrderCode
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Lỗi khi kết nối PayOS: " + ex.Message });
            }
        }

        [HttpPost("create-payment-link/single/{orderId:guid}")]
        [Authorize]
        public async Task<IActionResult> CreatePaymentLinkSingle(Guid orderId)
        {
            var requesterIdValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(requesterIdValue, out var requesterId))
                return Unauthorized();

            var orderRepo = _unitOfWork.Repository<OrderRequest>();
            var order = await orderRepo.GetByIdAsync(orderId);
            
            if (order == null || (order.UserId != requesterId && !User.IsInRole("Admin")))
                return NotFound(new { message = "Không tìm thấy đơn hàng." });
            
            if (order.Status != CloudService.Domain.Enums.OrderStatus.Pending)
                return BadRequest(new { message = "Đơn hàng không ở trạng thái chờ thanh toán." });

            if (!order.OrderGroupId.HasValue)
                return BadRequest(new { message = "Đơn hàng không thuộc nhóm hợp lệ." });

            return await CreatePaymentLink(order.OrderGroupId.Value);
        }

        [HttpPost("webhook")]
        [AllowAnonymous]
        public async Task<IActionResult> Webhook([FromBody] global::PayOS.Models.Webhooks.Webhook webhookBody)
        {
            try
            {
                var webhookData = await _payOS.Webhooks.VerifyAsync(webhookBody);

                if (webhookData.Description == "Ma giao dich thu nghiem" || webhookData.Description == "VQRIO123")
                {
                    return Ok(new { message = "Webhook test successful" });
                }

                if (webhookData.Code == "00")
                {
                    var orderCode = webhookData.OrderCode;
                    var orderRepo = _unitOfWork.Repository<OrderRequest>();
                    var orders = await orderRepo.SelectToListAsync(q => q.Where(o => o.AdminNotes != null && o.AdminNotes.Contains(orderCode.ToString())));
                    var order = orders.FirstOrDefault();

                    if (order != null && order.OrderGroupId.HasValue)
                    {
                        await _orderService.ConfirmPayOsPaymentGroupAsync(order.OrderGroupId.Value);
                    }
                }

                return Ok(new { message = "Webhook received" });
            }
            catch (Exception ex)
            {
                Console.WriteLine("Webhook Error: " + ex.Message);
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}

