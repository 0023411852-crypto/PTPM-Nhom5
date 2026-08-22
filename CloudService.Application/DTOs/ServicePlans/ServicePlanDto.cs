using CloudService.Application.DTOs.ServiceCategories;

namespace CloudService.Application.DTOs.ServicePlans
{
    public class ServicePlanDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Specifications { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public string? QRCodeBase64 { get; set; }
        public DateTime CreatedAt { get; set; }
        public ServiceCategoryDto Category { get; set; } = null!;
    }
}
