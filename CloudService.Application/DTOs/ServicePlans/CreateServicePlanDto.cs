using System.ComponentModel.DataAnnotations;

namespace CloudService.Application.DTOs.ServicePlans
{
    public class CreateServicePlanDto
    {
        [Required(ErrorMessage = "Category Id is required")]
        public Guid CategoryId { get; set; }

        [Required(ErrorMessage = "Plan Name is required")]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        public string Specifications { get; set; } = "{}";

        public bool IsActive { get; set; } = true;
    }
}
