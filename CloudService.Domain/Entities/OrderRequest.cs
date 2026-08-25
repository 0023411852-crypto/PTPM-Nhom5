using CloudService.Domain.Common;
using CloudService.Domain.Enums;

namespace CloudService.Domain.Entities
{
    public class OrderRequest : BaseEntity
    {
        public Guid UserId { get; set; }
        public virtual AppUser User { get; set; } = null!;

        public Guid ServicePlanId { get; set; }
        public virtual ServicePlan ServicePlan { get; set; } = null!;

        public Guid PlanPriceId { get; set; }
        public virtual PlanPrice PlanPrice { get; set; } = null!;

        public Guid? PromotionId { get; set; }
        public virtual Promotion? Promotion { get; set; }

        public decimal TotalAmount { get; set; }
        public OrderStatus Status { get; set; } = OrderStatus.Pending;
        
        public string? CustomerNotes { get; set; }
        public string? AdminNotes { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    }
}
