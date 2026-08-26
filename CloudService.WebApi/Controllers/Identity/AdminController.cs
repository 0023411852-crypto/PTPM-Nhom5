using CloudService.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloudService.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var stats = await _adminService.GetDashboardStatsAsync();
            return Ok(stats);
        }
        [HttpGet("revenue-report")]
        public async Task<IActionResult> GetRevenueReport([FromQuery] string period = "Tháng này")
        {
            var report = await _adminService.GetRevenueReportAsync(period);
            return Ok(report);
        }

        [HttpGet("revenue-report/export")]
        public async Task<IActionResult> ExportRevenueReport([FromQuery] string period = "Tháng này")
        {
            var fileBytes = await _adminService.ExportRevenueReportAsync(period);
            return File(fileBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"BaoCaoDoanhThu_{period}.xlsx");
        }
    }
}
