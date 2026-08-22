using System.Threading.Tasks;

namespace CloudService.Application.Interfaces
{
    public interface IAdminService
    {
        Task<object> GetDashboardStatsAsync();
        Task<CloudService.Application.DTOs.Admin.RevenueReportDto> GetRevenueReportAsync(string period);
    }
}
