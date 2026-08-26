using CloudService.Application.Common;
using CloudService.Application.DTOs.AffiliateApplications;
using CloudService.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CloudService.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AffiliateApplicationsController : ControllerBase
    {
        private readonly IAffiliateApplicationService _service;

        public AffiliateApplicationsController(IAffiliateApplicationService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateAffiliateApplicationDto dto)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdStr, out var userId))
                return Unauthorized();

            try
            {
                var result = await _service.CreateAsync(userId, dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("my-application")]
        public async Task<IActionResult> GetMyApplication()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdStr, out var userId))
                return Unauthorized();

            var result = await _service.GetByUserIdAsync(userId);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll([FromQuery] PaginationFilter filter)
        {
            var result = await _service.GetAllAsync(filter);
            return Ok(result);
        }

        [HttpPatch("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateAffiliateApplicationDto dto)
        {
            try
            {
                var result = await _service.UpdateStatusAsync(id, dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("admin-create")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AdminCreate([FromBody] AdminCreatePartnerDto dto)
        {
            try
            {
                var result = await _service.AdminCreatePartnerAsync(dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("seed")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SeedData()
        {
            try
            {
                await _service.SeedDataAsync();
                return Ok(new { message = "Seeded partner data successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
