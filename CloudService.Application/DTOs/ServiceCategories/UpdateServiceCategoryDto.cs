using System.ComponentModel.DataAnnotations;

namespace CloudService.Application.DTOs.ServiceCategories
{
    public class UpdateServiceCategoryDto
    {
        [Required(ErrorMessage = "Category Name is required")]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        [MaxLength(200)]
        public string DetailTitle { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Icon { get; set; } = "dns";

        public string FeaturesJson { get; set; } = "[]";

        public bool IsActive { get; set; }
    }
}
