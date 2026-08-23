using System;
using System.ComponentModel.DataAnnotations;

namespace CloudService.Application.DTOs.ServiceFeatures
{
    public class CreateServiceFeatureDto
    {
        [Required]
        public Guid ServiceCategoryId { get; set; }

        [Required]
        [MaxLength(255)]
        public string Name { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;
        public int DisplayOrder { get; set; } = 0;
    }
}
