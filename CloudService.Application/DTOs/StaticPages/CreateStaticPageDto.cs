using System.ComponentModel.DataAnnotations;

namespace CloudService.Application.DTOs.StaticPages
{
    public class CreateStaticPageDto
    {
        [Required]
        [MaxLength(255)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        public string Slug { get; set; } = string.Empty;

        public string Content { get; set; } = string.Empty;

        public bool IsPublished { get; set; } = true;
    }
}
