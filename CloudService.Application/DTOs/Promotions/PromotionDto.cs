using System.ComponentModel.DataAnnotations;

namespace CloudService.Application.DTOs.Promotions
{
    public class PromotionDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string BadgeText { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public bool IsFeatured { get; set; }
        public List<Guid> ServicePlanIds { get; set; } = new();
        public string Code { get; set; } = string.Empty;
        public decimal DiscountPercentage { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsActive { get; set; }
    }

    public class CreatePromotionDto
    {
        [Required]
        [MaxLength(255)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string BadgeText { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Category { get; set; } = string.Empty;

        public bool IsFeatured { get; set; }

        public List<Guid> ServicePlanIds { get; set; } = new();
        public string Code { get; set; } = string.Empty;
        public decimal DiscountPercentage { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class UpdatePromotionDto
    {
        [Required]
        [MaxLength(255)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string BadgeText { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Category { get; set; } = string.Empty;

        public bool IsFeatured { get; set; }

        public List<Guid> ServicePlanIds { get; set; } = new();
        public string Code { get; set; } = string.Empty;
        public decimal DiscountPercentage { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsActive { get; set; }
    }
}
