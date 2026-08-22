using System.ComponentModel.DataAnnotations;

namespace CloudService.Application.DTOs.AffiliateApplications
{
    public class CreateAffiliateApplicationDto
    {
        [Required]
        [Url]
        [MaxLength(500)]
        public string WebsiteUrl { get; set; } = string.Empty;

        [Required]
        public string PromotionalMethods { get; set; } = string.Empty;
    }
}
