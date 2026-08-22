using CloudService.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace CloudService.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet("editor-stats")]
        [Authorize]
        public async Task<IActionResult> GetEditorStats()
        {
            var stats = await _dashboardService.GetEditorStatsAsync();
            return Ok(new { data = stats });
        }
    }
}
