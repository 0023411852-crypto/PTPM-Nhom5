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
            var usersQuery = _userRepo.GetQueryable();
            var ordersQuery = _orderRepo.GetQueryable();
            var ticketsQuery = _ticketRepo.GetQueryable();

            var totalUsers = usersQuery.Count();
            var totalOrders = ordersQuery.Count();
            var pendingOrders = ordersQuery.Count(o => o.Status == CloudService.Domain.Enums.OrderStatus.Pending);
            var openTickets = ticketsQuery.Count(t => t.Status == "Open");
            var totalRevenue = ordersQuery.Where(o => o.Status == CloudService.Domain.Enums.OrderStatus.Completed).Sum(o => o.TotalAmount);

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
            var usersQuery = _userRepo.GetQueryable();
            var ordersQuery = _orderRepo.GetQueryable("ServicePlan,ServicePlan.Category");

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

            var currentOrders = ordersQuery.Where(o => o.OrderDate >= currentStart && o.OrderDate <= now).ToList();
            var previousOrders = ordersQuery.Where(o => o.OrderDate >= previousStart && o.OrderDate <= previousEnd).ToList();
            
            var currentUsers = usersQuery.Where(u => u.CreatedAt >= currentStart && u.CreatedAt <= now).ToList();
            var previousUsers = usersQuery.Where(u => u.CreatedAt >= previousStart && u.CreatedAt <= previousEnd).ToList();

            var currentCompletedOrders = currentOrders.Where(o => o.Status == CloudService.Domain.Enums.OrderStatus.Completed).ToList();
            var previousCompletedOrders = previousOrders.Where(o => o.Status == CloudService.Domain.Enums.OrderStatus.Completed).ToList();
            var currentRevenue = currentCompletedOrders.Sum(o => o.TotalAmount);
            var previousRevenue = previousCompletedOrders.Sum(o => o.TotalAmount);

            var currentTrans = currentCompletedOrders.Count;
            var previousTrans = previousCompletedOrders.Count;

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
            var completedOrders = currentCompletedOrders;
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

        public async Task<byte[]> ExportRevenueReportAsync(string period)
        {
            var report = await GetRevenueReportAsync(period);
            using var workbook = new ClosedXML.Excel.XLWorkbook();
            var worksheet = workbook.Worksheets.Add("DoanhThu");

            worksheet.Cell(1, 1).Value = "Báo Cáo Doanh Thu";
            worksheet.Cell(1, 1).Style.Font.Bold = true;
            worksheet.Cell(1, 1).Style.Font.FontSize = 14;

            worksheet.Cell(2, 1).Value = "Thời gian:";
            worksheet.Cell(2, 2).Value = period;

            // Summary
            worksheet.Cell(4, 1).Value = "Doanh thu thuần";
            worksheet.Cell(4, 2).Value = report.Revenue;
            worksheet.Cell(4, 3).Value = report.RevenueGrowth;

            worksheet.Cell(5, 1).Value = "Lượt giao dịch";
            worksheet.Cell(5, 2).Value = report.Transactions;
            worksheet.Cell(5, 3).Value = report.TransactionsGrowth;

            worksheet.Cell(6, 1).Value = "Giá trị TB/Đơn";
            worksheet.Cell(6, 2).Value = report.AOV;
            worksheet.Cell(6, 3).Value = report.AOVGrowth;

            worksheet.Cell(7, 1).Value = "Khách hàng mới";
            worksheet.Cell(7, 2).Value = report.NewUsers;
            worksheet.Cell(7, 3).Value = report.NewUsersGrowth;

            // Chart Data
            worksheet.Cell(9, 1).Value = "Chi tiết tăng trưởng";
            worksheet.Cell(9, 1).Style.Font.Bold = true;
            
            int row = 10;
            foreach (var item in report.BarChartData)
            {
                worksheet.Cell(row, 1).Value = item.Label;
                worksheet.Cell(row, 2).Value = item.Value + " M";
                row++;
            }

            // Service Breakdown
            row++;
            worksheet.Cell(row, 1).Value = "Tỷ trọng dịch vụ";
            worksheet.Cell(row, 1).Style.Font.Bold = true;
            row++;
            foreach (var item in report.ServiceBreakdown)
            {
                worksheet.Cell(row, 1).Value = item.Name;
                worksheet.Cell(row, 2).Value = item.Percentage + "%";
                row++;
            }

            worksheet.Columns().AdjustToContents();

            using var stream = new System.IO.MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }
    }
}
