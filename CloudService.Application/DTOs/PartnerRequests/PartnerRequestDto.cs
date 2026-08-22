using System;

namespace CloudService.Application.DTOs.PartnerRequests
{
    public class PartnerRequestDto
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string WebsiteUrl { get; set; } = string.Empty;
        public string PromotionMethod { get; set; } = string.Empty;
        public string PromotionDetails { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
