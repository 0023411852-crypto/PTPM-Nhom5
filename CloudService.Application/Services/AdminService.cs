using System.Linq;
using System.Threading.Tasks;
using CloudService.Application.Interfaces;
using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;

namespace CloudService.Application.Services
{
    public class AdminService : IAdminService
    {
        private readonly IGenericRepository<AppUser> _userRepo;
        private readonly IGenericRepository<OrderRequest> _orderRepo;
        private readonly IGenericRepository<SupportTicket> _ticketRepo;

        public AdminService(
            IGenericRepository<AppUser> userRepo,
            IGenericRepository<OrderRequest> orderRepo,
            IGenericRepository<SupportTicket> ticketRepo)
        {
            _userRepo = userRepo;
            _orderRepo = orderRepo;
            _ticketRepo = ticketRepo;
        }

        public async Task<object> GetDashboardStatsAsync()
        {
            var users = await _userRepo.GetAllAsync();
            var orders = await _orderRepo.GetAllAsync();
            var tickets = await _ticketRepo.GetAllAsync();

            var totalUsers = users.Count();
            var totalOrders = orders.Count();
            var pendingOrders = orders.Count(o => o.Status == CloudService.Domain.Enums.OrderStatus.Pending);
            var openTickets = tickets.Count(t => t.Status == "Open");
            var totalRevenue = orders.Where(o => o.Status == CloudService.Domain.Enums.OrderStatus.Completed).Sum(o => o.TotalAmount);

            return new 
            {
                totalUsers,
                totalOrders,
                pendingOrders,
                openTickets,
                totalRevenue
            };
        }

        public async Task<CloudService.Application.DTOs.Admin.RevenueReportDto> GetRevenueReportAsync(string period)
        {
            var users = await _userRepo.GetAllAsync();
            var orders = (await _orderRepo.GetAllAsync("ServicePlan,ServicePlan.Category")).ToList();

            var now = DateTime.UtcNow;
            DateTime currentStart, previousStart, previousEnd;

            if (period == "Năm nay")
            {
                currentStart = new DateTime(now.Year, 1, 1);
                previousStart = currentStart.AddYears(-1);
                previousEnd = currentStart.AddTicks(-1);
            }
            else if (period == "Quý này")
            {
                int quarter = (now.Month - 1) / 3 + 1;
                currentStart = new DateTime(now.Year, (quarter - 1) * 3 + 1, 1);
                previousStart = currentStart.AddMonths(-3);
                previousEnd = currentStart.AddTicks(-1);
            }
            else // "Tháng này"
            {
                currentStart = new DateTime(now.Year, now.Month, 1);
                previousStart = currentStart.AddMonths(-1);
                previousEnd = currentStart.AddTicks(-1);
            }

            var currentOrders = orders.Where(o => o.OrderDate >= currentStart && o.OrderDate <= now).ToList();
            var previousOrders = orders.Where(o => o.OrderDate >= previousStart && o.OrderDate <= previousEnd).ToList();
            
            var currentUsers = users.Where(u => u.CreatedAt >= currentStart && u.CreatedAt <= now).ToList();
            var previousUsers = users.Where(u => u.CreatedAt >= previousStart && u.CreatedAt <= previousEnd).ToList();

            var currentRevenue = currentOrders.Where(o => o.Status == CloudService.Domain.Enums.OrderStatus.Completed).Sum(o => o.TotalAmount);
            var previousRevenue = previousOrders.Where(o => o.Status == CloudService.Domain.Enums.OrderStatus.Completed).Sum(o => o.TotalAmount);

            var currentTrans = currentOrders.Count();
            var previousTrans = previousOrders.Count();

            var currentAov = currentTrans > 0 ? currentRevenue / currentTrans : 0;
            var previousAov = previousTrans > 0 ? previousRevenue / previousTrans : 0;

            string FormatGrowth(decimal cur, decimal prev)
            {
                if (prev == 0) return cur > 0 ? "+100%" : "0%";
                var diff = ((cur - prev) / prev) * 100;
                return diff > 0 ? $"+{diff:0.1}%" : $"{diff:0.1}%";
            }

            string FormatCurrency(decimal amount)
            {
                if (amount >= 1_000_000_000) return $"{amount / 1_000_000_000:0.0}B";
                if (amount >= 1_000_000) return $"{amount / 1_000_000:0.0}M";
                if (amount >= 1_000) return $"{amount / 1_000:0}K";
                return $"{amount:0}";
            }

            var report = new CloudService.Application.DTOs.Admin.RevenueReportDto
            {
                Revenue = FormatCurrency(currentRevenue),
                RevenueGrowth = FormatGrowth(currentRevenue, previousRevenue),
                Transactions = currentTrans.ToString("N0"),
                TransactionsGrowth = FormatGrowth(currentTrans, previousTrans),
                AOV = FormatCurrency(currentAov),
                AOVGrowth = FormatGrowth(currentAov, previousAov),
                NewUsers = currentUsers.Count().ToString("N0"),
                NewUsersGrowth = FormatGrowth(currentUsers.Count(), previousUsers.Count())
            };

            // Chart Data
            var chartData = new List<CloudService.Application.DTOs.Admin.ChartDataDto>();
            if (period == "Năm nay")
            {
                for (int i = 1; i <= now.Month; i++)
                {
                    var mStart = new DateTime(now.Year, i, 1);
                    var mEnd = mStart.AddMonths(1).AddTicks(-1);
                    var val = currentOrders.Where(o => o.Status == CloudService.Domain.Enums.OrderStatus.Completed && o.OrderDate >= mStart && o.OrderDate <= mEnd).Sum(o => o.TotalAmount);
                    chartData.Add(new CloudService.Application.DTOs.Admin.ChartDataDto { Label = $"T{i}", Value = val / 1_000_000m }); // In Millions
                }
            }
            else
            {
                // Last 7 days
                for (int i = 6; i >= 0; i--)
                {
                    var day = now.Date.AddDays(-i);
                    var val = currentOrders.Where(o => o.Status == CloudService.Domain.Enums.OrderStatus.Completed && o.OrderDate.Date == day).Sum(o => o.TotalAmount);
                    chartData.Add(new CloudService.Application.DTOs.Admin.ChartDataDto { Label = day.ToString("dd/MM"), Value = val / 1_000_000m });
                }
            }
            report.BarChartData = chartData;

            // Service Breakdown
            var categoryColors = new[] { "bg-primary", "bg-tertiary-container", "bg-error-container", "bg-warning" };
            var completedOrders = currentOrders.Where(o => o.Status == CloudService.Domain.Enums.OrderStatus.Completed).ToList();
            if (completedOrders.Any())
            {
                var grouped = completedOrders
                    .Where(o => o.ServicePlan != null && o.ServicePlan.Category != null)
                    .GroupBy(o => o.ServicePlan.Category.Name)
                    .Select((g, i) => new CloudService.Application.DTOs.Admin.ServiceBreakdownDto
                    {
                        Name = g.Key,
                        Percentage = (int)Math.Round((double)g.Count() / completedOrders.Count * 100),
                        ColorClass = categoryColors[i % categoryColors.Length]
                    })
                    .ToList();
                report.ServiceBreakdown = grouped;
            }

            return report;
        }
    }
}
