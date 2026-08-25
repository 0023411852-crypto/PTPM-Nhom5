using AutoMapper;
using CloudService.Application.DTOs.Dashboard;
using CloudService.Application.DTOs.NewsArticles;
using CloudService.Application.Interfaces;
using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CloudService.Application.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public DashboardService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<EditorDashboardStatsDto> GetEditorStatsAsync()
        {
            var stats = new EditorDashboardStatsDto();

            var articleRepo = _unitOfWork.Repository<NewsArticle>();
            var ticketRepo = _unitOfWork.Repository<SupportTicket>();

            var articleQuery = articleRepo.GetQueryable();
            var ticketQuery = ticketRepo.GetQueryable();

            var firstDayOfMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);

            stats.TotalViews = articleQuery.Sum(a => a.ViewCount);
            
            stats.NewArticlesCount = articleQuery.Count(a => a.CreatedAt >= firstDayOfMonth);

            stats.NewTicketsCount = ticketQuery.Count(t => t.Status == "Open" || t.Status == "Mới");

            var trending = articleQuery
                .Where(a => a.IsPublished)
                .OrderByDescending(a => a.ViewCount)
                .Take(3)
                .ToList();

            stats.TrendingArticles = _mapper.Map<List<NewsArticleDto>>(trending);

            return stats;
        }
    }
}
