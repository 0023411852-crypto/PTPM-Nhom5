using CloudService.Domain.Enums;

namespace CloudService.Application.DTOs.AffiliateApplications
{
    public class AffiliateApplicationDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string WebsiteUrl { get; set; } = string.Empty;
        public string PromotionalMethods { get; set; } = string.Empty;
        public AffiliateStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
