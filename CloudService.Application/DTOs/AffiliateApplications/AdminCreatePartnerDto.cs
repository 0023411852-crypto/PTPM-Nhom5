using CloudService.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace CloudService.Application.DTOs.AffiliateApplications
{
    public class AdminCreatePartnerDto
    {
        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public string WebsiteUrl { get; set; } = string.Empty;

        [Required]
        public string PromotionalMethods { get; set; } = string.Empty;

        public AffiliateStatus Status { get; set; } = AffiliateStatus.Approved;
    }
}
