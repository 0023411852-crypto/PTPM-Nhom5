using System.ComponentModel.DataAnnotations;

namespace CloudService.Application.DTOs.Orders
{
    public class ApproveOrderDto
    {
        [Required]
        public string VpsIP { get; set; } = string.Empty;
        
        [Required]
        public string VpsUser { get; set; } = string.Empty;
        
        [Required]
        public string VpsPassword { get; set; } = string.Empty;
    }
}
