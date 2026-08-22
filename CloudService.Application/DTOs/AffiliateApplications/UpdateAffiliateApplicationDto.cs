using CloudService.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace CloudService.Application.DTOs.AffiliateApplications
{
    public class UpdateAffiliateApplicationDto
    {
        [Required]
        public AffiliateStatus Status { get; set; }
    }
}
