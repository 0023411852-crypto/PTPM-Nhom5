using CloudService.Application.Common;
using CloudService.Application.DTOs.SupportTickets;
using CloudService.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CloudService.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SupportTicketsController : ControllerBase
    {
        private readonly ISupportTicketService _service;

        public SupportTicketsController(ISupportTicketService service)
        {
            _service = service;
        }

        [HttpGet("my-tickets")]
        public async Task<IActionResult> GetMyTickets([FromQuery] PaginationFilter filter)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdStr, out var userId))
                return Unauthorized();

            var result = await _service.GetMyTicketsAsync(userId, filter);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTicketById(Guid id)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdStr, out var userId))
                return Unauthorized();

            var result = await _service.GetTicketByIdAsync(id, userId);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTicket([FromBody] CreateSupportTicketDto dto)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdStr, out var userId))
                return Unauthorized();

            var result = await _service.CreateTicketAsync(userId, dto);
            return Ok(result);
        }

        [HttpPost("{id}/reply")]
        public async Task<IActionResult> ReplyToTicket(Guid id, [FromBody] CreateTicketReplyDto dto)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdStr, out var userId))
                return Unauthorized();

            var isAdmin = User.IsInRole("Admin");

            try
            {
                var result = await _service.ReplyToTicketAsync(userId, id, dto, isAdmin);
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllTickets([FromQuery] PaginationFilter filter)
        {
            var result = await _service.GetAllTicketsAsync(filter);
            return Ok(result);
        }

        [HttpPatch("{id}/close")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CloseTicket(Guid id)
        {
            var result = await _service.CloseTicketAsync(id);
            if (!result) return NotFound();
            return Ok(new { message = "Ticket closed successfully" });
        }
    }
}
