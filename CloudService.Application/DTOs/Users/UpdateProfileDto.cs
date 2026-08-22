using System.ComponentModel.DataAnnotations;

namespace CloudService.Application.DTOs.Users
{
    public class UpdateProfileDto
    {
        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;
    }
}
