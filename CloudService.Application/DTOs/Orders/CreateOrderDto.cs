using System.ComponentModel.DataAnnotations;

namespace CloudService.Application.DTOs.Orders
{
    public class CreateOrderDto
    {
        [Required]
        public Guid ServicePlanId { get; set; }
        
        [Required]
        public Guid PlanPriceId { get; set; }
        
        [Required]
        public int BillingCycle { get; set; }

        public Guid? PromotionId { get; set; }

        public string? CustomerNotes { get; set; }
    }

    public class CreateOrderItemDto
    {
        [Required]
        public Guid ServicePlanId { get; set; }
        
        [Required]
        public Guid PlanPriceId { get; set; }
        
        [Required]
        public int BillingCycle { get; set; }

        public Guid? PromotionId { get; set; }

        public int Quantity { get; set; } = 1;
    }

    public class CreateOrderBatchDto
    {
        [Required]
        [MinLength(1)]
        public List<CreateOrderItemDto> Items { get; set; } = new();

        public string? CustomerNotes { get; set; }
    }
}
