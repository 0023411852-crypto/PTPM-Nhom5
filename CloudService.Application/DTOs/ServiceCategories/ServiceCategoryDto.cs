namespace CloudService.Application.DTOs.ServiceCategories
{
    public class ServiceCategoryDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string DetailTitle { get; set; } = string.Empty;
        public string Icon { get; set; } = "dns";
        public string FeaturesJson { get; set; } = "[]";
        public string Slug { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
