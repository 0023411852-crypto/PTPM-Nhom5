using CloudService.Application.DTOs;
using CloudService.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace CloudService.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SiteSettingsController : ControllerBase
    {
        private readonly ISiteSettingService _service;

        public SiteSettingsController(ISiteSettingService service)
        {
            _service = service;
        }

        [HttpGet("public")]
        public async Task<IActionResult> GetPublicSettings()
        {
            var settings = await _service.GetAllSettingsAsync();
            return Ok(settings);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllSettings()
        {
            var settings = await _service.GetAllSettingsAsync();
            return Ok(settings);
        }

        [HttpPut("{key}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateSetting(string key, [FromBody] string value)
        {
            var result = await _service.UpdateSettingAsync(key, value);
            if (!result) return NotFound(new { message = "Setting not found" });
            return Ok(new { message = "Setting updated successfully" });
        }
    }
}
