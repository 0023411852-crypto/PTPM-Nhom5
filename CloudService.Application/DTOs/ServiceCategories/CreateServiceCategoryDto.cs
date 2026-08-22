using System.ComponentModel.DataAnnotations;

namespace CloudService.Application.DTOs.ServiceCategories
{
    public class CreateServiceCategoryDto
    {
        [Required(ErrorMessage = "Category Name is required")]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;
    }
}
