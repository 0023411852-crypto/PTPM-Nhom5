using CloudService.Domain.Common;
using CloudService.Domain.Enums;

namespace CloudService.Domain.Entities
{
    public class AffiliateApplication : BaseEntity
    {
        public Guid UserId { get; set; }
        public virtual AppUser User { get; set; } = null!;

        public AffiliateStatus Status { get; set; } = AffiliateStatus.Pending;
        public string WebsiteUrl { get; set; } = string.Empty;
        public string PromotionMethod { get; set; } = string.Empty;
        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;
    }
}
