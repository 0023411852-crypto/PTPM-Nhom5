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

            var allArticles = await articleRepo.GetAllAsync();
            var allTickets = await ticketRepo.GetAllAsync();

            var firstDayOfMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);

            stats.TotalViews = allArticles.Sum(a => a.ViewCount);
            
            stats.NewArticlesCount = allArticles.Count(a => a.CreatedAt >= firstDayOfMonth);

            stats.NewTicketsCount = allTickets.Count(t => t.Status == "Open" || t.Status == "Mới");

            var trending = allArticles
                .Where(a => a.IsPublished)
                .OrderByDescending(a => a.ViewCount)
                .Take(3)
                .ToList();

            stats.TrendingArticles = _mapper.Map<List<NewsArticleDto>>(trending);

            return stats;
        }
    }
}
