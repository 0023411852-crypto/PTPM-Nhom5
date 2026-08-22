using System.ComponentModel.DataAnnotations;

namespace CloudService.Application.DTOs.Users
{
    public class CreateReviewDto
    {
        public Guid? OrderId { get; set; }
        
        [Required]
        [Range(1, 5)]
        public decimal Rating { get; set; }
        
        [Required]
        [MaxLength(1000)]
        public string Content { get; set; } = string.Empty;
    }
}
