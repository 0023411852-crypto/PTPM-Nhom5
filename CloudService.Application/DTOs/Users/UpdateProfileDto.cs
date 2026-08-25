using System.ComponentModel.DataAnnotations;

namespace CloudService.Application.DTOs.Users
{
    public class UpdateProfileDto
    {
        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(255)]
        public string Email { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? AvatarUrl { get; set; }
    }
}
