using CloudService.Domain.Common;

namespace CloudService.Domain.Entities
{
    public class Promotion : BaseEntity
    {
        public Guid ServicePlanId { get; set; }
        public virtual ServicePlan ServicePlan { get; set; } = null!;

        public string Code { get; set; } = string.Empty;
        public decimal DiscountPercentage { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
