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

            var firstDayOfMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);

            var viewCounts = await articleRepo.SelectToListAsync(q => q.Select(a => a.ViewCount));
            stats.TotalViews = viewCounts.Sum();
            
            stats.NewArticlesCount = await articleRepo.CountAsync(q => q.Where(a => a.CreatedAt >= firstDayOfMonth));

            stats.NewTicketsCount = await ticketRepo.CountAsync(q => q.Where(t => t.Status == "Open" || t.Status == "Mới"));

            var trending = await articleRepo.ToListAsync(q => q
                .Where(a => a.IsPublished)
                .OrderByDescending(a => a.ViewCount)
                .Take(3));

            stats.TrendingArticles = _mapper.Map<List<NewsArticleDto>>(trending);

            return stats;
        }
    }
}
