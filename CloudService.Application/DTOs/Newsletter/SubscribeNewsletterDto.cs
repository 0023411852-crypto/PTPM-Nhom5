using System.ComponentModel.DataAnnotations;

namespace CloudService.Application.DTOs.Newsletter
{
    public class SubscribeNewsletterDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
}
