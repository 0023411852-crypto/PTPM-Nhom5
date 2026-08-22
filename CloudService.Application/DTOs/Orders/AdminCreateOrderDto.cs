using System.ComponentModel.DataAnnotations;

namespace CloudService.Application.DTOs.Orders
{
    public class AdminCreateOrderDto
    {
        [Required]
        public Guid UserId { get; set; }
        
        [Required]
        public Guid ServicePlanId { get; set; }
        
        [Required]
        public Guid PlanPriceId { get; set; }
        
        public string? AdminNotes { get; set; }
        public string Status { get; set; } = "Completed";
    }
}
