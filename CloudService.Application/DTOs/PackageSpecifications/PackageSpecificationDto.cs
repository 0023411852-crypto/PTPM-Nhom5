using System;

namespace CloudService.Application.DTOs.PackageSpecifications
{
    public class PackageSpecificationDto
    {
        public Guid Id { get; set; }
        public Guid ServicePlanId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public string Unit { get; set; } = string.Empty;
        public int DisplayOrder { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
