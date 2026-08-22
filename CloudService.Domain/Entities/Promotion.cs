using CloudService.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace CloudService.Domain.Entities
{
    public class Promotion : BaseEntity
    {
        // For general campaigns
        [MaxLength(255)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(50)]
        public string BadgeText { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Category { get; set; } = string.Empty; // e.g., Cloud, Hosting, Domain, Email

        public bool IsFeatured { get; set; }

        // For specific plan discounts (Optional)
        public Guid? ServicePlanId { get; set; }
        public virtual ServicePlan? ServicePlan { get; set; }

        public string Code { get; set; } = string.Empty;
        public decimal DiscountPercentage { get; set; }
        
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
