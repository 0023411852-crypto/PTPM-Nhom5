using CloudService.Domain.Common;

namespace CloudService.Domain.Entities
{
    public class PlanPrice : BaseEntity
    {
        public Guid ServicePlanId { get; set; }
        public virtual ServicePlan ServicePlan { get; set; } = null!;

        public int BillingCycle { get; set; } // in months: 1, 3, 6, 12, 24, 36
        public decimal Price { get; set; }
        public decimal SetupFee { get; set; }
    }
}
