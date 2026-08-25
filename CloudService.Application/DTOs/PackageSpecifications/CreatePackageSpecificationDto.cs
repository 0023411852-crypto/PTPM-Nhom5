using System;
using System.ComponentModel.DataAnnotations;

namespace CloudService.Application.DTOs.PackageSpecifications
{
    public class CreatePackageSpecificationDto
    {
        [Required]
        public Guid ServicePlanId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        public string Value { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Unit { get; set; } = string.Empty;

        public int DisplayOrder { get; set; } = 0;
    }
}
