using System;

namespace CloudService.Application.DTOs.ServiceFeatures
{
    public class ServiceFeatureDto
    {
        public Guid Id { get; set; }
        public Guid ServiceCategoryId { get; set; }
        public string Name { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public int DisplayOrder { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
