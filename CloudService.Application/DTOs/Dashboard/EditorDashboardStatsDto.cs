using CloudService.Application.DTOs.NewsArticles;
using System.Collections.Generic;

namespace CloudService.Application.DTOs.Dashboard
{
    public class EditorDashboardStatsDto
    {
        public int TotalViews { get; set; }
        public int NewArticlesCount { get; set; }
        public int NewTicketsCount { get; set; }
        public List<NewsArticleDto> TrendingArticles { get; set; } = new List<NewsArticleDto>();
    }
}
