using CloudService.Domain.Common;
using System;

namespace CloudService.Domain.Entities
{
    public class PartnerRequest : BaseEntity
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string WebsiteUrl { get; set; } = string.Empty;
        public string PromotionMethod { get; set; } = string.Empty;
        public string PromotionDetails { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected
        public string Notes { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
