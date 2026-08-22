using CloudService.Application.Common;
using CloudService.Application.DTOs.Users;
using CloudService.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CloudService.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var user = await _userService.GetUserByIdAsync(userId);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpPut("me/profile")]
        public async Task<IActionResult> UpdateMyProfile([FromBody] UpdateProfileDto dto)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var success = await _userService.UpdateProfileAsync(userId, dto);
            if (!success) return BadRequest(new { message = "Cập nhật thất bại." });
            return Ok(new { message = "Cập nhật thông tin thành công." });
        }

        [HttpPut("me/password")]
        public async Task<IActionResult> ChangeMyPassword([FromBody] ChangePasswordDto dto)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            try
            {
                var success = await _userService.ChangePasswordAsync(userId, dto);
                return Ok(new { message = "Đổi mật khẩu thành công." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("me/activities")]
        public async Task<IActionResult> GetMyActivities()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var result = await _userService.GetMyActivitiesAsync(userId);
            return Ok(result);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllUsers([FromQuery] PaginationFilter filter)
        {
            var result = await _userService.GetAllUsersAsync(filter);
            return Ok(result);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUserById(Guid id)
        {
            var result = await _userService.GetUserByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpGet("{id}/activities")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUserActivities(Guid id)
        {
            var result = await _userService.GetUserActivitiesAdminAsync(id);
            return Ok(result);
        }

        [HttpPatch("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateUserStatusDto dto)
        {
            var adminIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(adminIdStr, out var adminId)) return Unauthorized();

            try
            {
                var success = await _userService.UpdateUserStatusAsync(adminId, id, dto);
                if (!success) return NotFound();
                return Ok(new { message = "Cập nhật trạng thái thành công." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}/role")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AssignRole(Guid id, [FromBody] string roleName)
        {
            var adminIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(adminIdStr, out var adminId)) return Unauthorized();

            try
            {
                var success = await _userService.AssignRoleAsync(adminId, id, roleName);
                if (!success) return NotFound();
                return Ok(new { message = "Cấp quyền thành công." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
        {
            var adminIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(adminIdStr, out var adminId)) return Unauthorized();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var result = await _userService.CreateUserAsync(adminId, dto);
                return CreatedAtAction(nameof(GetUserById), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ScheduleDelete(Guid id)
        {
            var adminIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(adminIdStr, out var adminId)) return Unauthorized();

            try
            {
                var success = await _userService.ScheduleDeleteUserAsync(adminId, id);
                if (!success) return NotFound();
                return Ok(new { message = "Đã lên lịch xóa tài khoản sau 3 ngày." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("{id}/cancel-delete")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CancelDelete(Guid id)
        {
            var adminIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(adminIdStr, out var adminId)) return Unauthorized();

            try
            {
                var success = await _userService.CancelDeleteUserAsync(adminId, id);
                if (!success) return NotFound();
                return Ok(new { message = "Đã hủy yêu cầu xóa tài khoản." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
