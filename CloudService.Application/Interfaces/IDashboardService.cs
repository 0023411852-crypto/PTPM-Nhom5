using CloudService.Application.DTOs.Dashboard;
using System.Threading.Tasks;

namespace CloudService.Application.Interfaces
{
    public interface IDashboardService
    {
        Task<EditorDashboardStatsDto> GetEditorStatsAsync();
    }
}
