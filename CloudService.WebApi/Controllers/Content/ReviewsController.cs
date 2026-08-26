using CloudService.Application.DTOs.Users;
using CloudService.Infrastructure.Data;
using CloudService.Domain.Entities;
using CloudService.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CloudService.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReviewsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetReviews([FromQuery] int page = 1, [FromQuery] int pageSize = 3)
        {
            page = Math.Max(1, page);
            pageSize = Math.Clamp(pageSize, 1, 100);

            var query = _context.CustomerReviews
                .AsNoTracking()
                .Where(r => r.IsVisible)
                .OrderBy(r => r.SortOrder);
            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                HasNextPage = page * pageSize < totalCount,
                Items = items
            });
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateReview([FromBody] CreateReviewDto dto)
        {
            var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdValue, out var userId))
            {
                return Unauthorized();
            }

            var user = await _context.AppUsers.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            if (dto.OrderId.HasValue)
            {
                var order = await _context.OrderRequests.FindAsync(dto.OrderId.Value);
                if (order == null || order.UserId != userId || order.Status != OrderStatus.Completed)
                {
                    return BadRequest("Bạn chỉ có thể đánh giá những đơn hàng đã hoàn thành của mình.");
                }

                var alreadyReviewed = await _context.CustomerReviews
                    .AnyAsync(r => r.OrderId == dto.OrderId.Value);
                if (alreadyReviewed)
                {
                    return Conflict("Bạn đã đánh giá đơn hàng này rồi.");
                }
            }

            var review = new CustomerReview
            {
                UserId = userId,
                OrderId = dto.OrderId,
                Rating = dto.Rating,
                Content = dto.Content,
                ReviewerName = user.FullName,
                ReviewerTitle = user.Company ?? "Khách hàng",
                ReviewerAvatar = user.AvatarUrl ?? "https://ui-avatars.com/api/?name=" + Uri.EscapeDataString(user.FullName),
                IsVisible = true,
                SortOrder = 0
            };

            _context.CustomerReviews.Add(review);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Cảm ơn bạn đã gửi đánh giá!" });
        }
    }
}
