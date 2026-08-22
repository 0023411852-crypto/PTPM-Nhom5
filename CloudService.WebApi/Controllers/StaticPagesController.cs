using CloudService.Application.Common;
using CloudService.Application.DTOs.StaticPages;
using CloudService.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CloudService.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaticPagesController : ControllerBase
    {
        private readonly IStaticPageService _service;

        public StaticPagesController(IStaticPageService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] PaginationFilter filter, [FromQuery] bool onlyPublished = false)
        {
            var result = await _service.GetAllAsync(filter, onlyPublished);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpGet("slug/{slug}")]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            var result = await _service.GetBySlugAsync(slug);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Editor")]
        public async Task<IActionResult> Create([FromBody] CreateStaticPageDto dto)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
                return Unauthorized();

            var result = await _service.CreateAsync(userId, dto);
            return Ok(result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Editor")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateStaticPageDto dto)
        {
            try
            {
                var result = await _service.UpdateAsync(id, dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Editor")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var success = await _service.DeleteAsync(id);
            if (!success) return NotFound();
            return Ok();
        }
    }
}
