using CloudService.Domain.Enums;

namespace CloudService.Application.DTOs.Orders
{
    public class OrderDetailDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string ServicePlanName { get; set; } = string.Empty;
        public string ServicePlanDescription { get; set; } = string.Empty;
        public string ServicePlanSpecifications { get; set; } = "{}";
        public string CategoryName { get; set; } = string.Empty;
        public int BillingCycle { get; set; }
        public decimal Price { get; set; }
        public decimal SetupFee { get; set; }
        public decimal TotalAmount { get; set; }
        public OrderStatus Status { get; set; }
        public DateTime OrderDate { get; set; }
        public string? CustomerNotes { get; set; }
        public string? AdminNotes { get; set; }
        public string? PromotionCode { get; set; }
        public decimal? DiscountPercentage { get; set; }
    }
}
