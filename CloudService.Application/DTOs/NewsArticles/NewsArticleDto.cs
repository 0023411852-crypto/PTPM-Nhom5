namespace CloudService.Application.DTOs.NewsArticles
{
    public class NewsArticleDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string AuthorName { get; set; } = string.Empty;
        public string ThumbnailUrl { get; set; } = string.Empty;
        public bool IsPublished { get; set; }
        public int ViewCount { get; set; }
        public Guid AuthorId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
