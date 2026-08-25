using System.ComponentModel.DataAnnotations;

namespace CloudService.Application.DTOs.Auth
{
    public class RefreshTokenRequest
    {
        [Required]
        public string RefreshToken { get; set; } = string.Empty;
    }
}
