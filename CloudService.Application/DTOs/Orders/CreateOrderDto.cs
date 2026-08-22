using System.ComponentModel.DataAnnotations;

namespace CloudService.Application.DTOs.Orders
{
    public class CreateOrderDto
    {
        [Required]
        public Guid ServicePlanId { get; set; }
        
        [Required]
        public Guid PlanPriceId { get; set; }
        
        public Guid? PromotionId { get; set; }

        public string? CustomerNotes { get; set; }
    }
}
