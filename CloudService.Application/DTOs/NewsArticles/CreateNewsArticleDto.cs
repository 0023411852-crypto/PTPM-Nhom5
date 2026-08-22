using System.ComponentModel.DataAnnotations;

namespace CloudService.Application.DTOs.NewsArticles
{
    public class CreateNewsArticleDto
    {
        [Required]
        [MaxLength(255)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Content { get; set; } = string.Empty;

        public bool IsPublished { get; set; } = true;
    }
}
