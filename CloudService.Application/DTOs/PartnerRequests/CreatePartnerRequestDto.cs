using System.ComponentModel.DataAnnotations;

namespace CloudService.Application.DTOs.PartnerRequests
{
    public class CreatePartnerRequestDto
    {
        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [MaxLength(200)]
        public string WebsiteUrl { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string PromotionMethod { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string PromotionDetails { get; set; } = string.Empty;
    }
}
