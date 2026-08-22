using System.ComponentModel.DataAnnotations;

namespace CloudService.Application.DTOs.PartnerRequests
{
    public class UpdatePartnerRequestStatusDto
    {
        [Required]
        public string Status { get; set; } = string.Empty; // Approved, Rejected

        public string Notes { get; set; } = string.Empty;
    }
}
