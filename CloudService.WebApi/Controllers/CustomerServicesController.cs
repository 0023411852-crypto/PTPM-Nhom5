using CloudService.Application.Common;
using CloudService.Application.DTOs.CustomerServices;
using CloudService.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CloudService.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CustomerServicesController : ControllerBase
    {
        private readonly ICustomerServiceAppService _service;

        public CustomerServicesController(ICustomerServiceAppService service)
        {
            _service = service;
        }

        [HttpGet("my-services")]
        public async Task<IActionResult> GetMyServices([FromQuery] PaginationFilter filter)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdStr, out var userId))
                return Unauthorized();

            var result = await _service.GetMyServicesAsync(userId, filter);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetServiceById(Guid id)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdStr, out var userId))
                return Unauthorized();

            var result = await _service.GetServiceByIdAsync(id, userId);
            if (result == null) return NotFound();
            return Ok(result);
        }
    }
}
