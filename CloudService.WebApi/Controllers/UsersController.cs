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
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly CloudService.Infrastructure.Data.ApplicationDbContext _context;

        public UsersController(IUserService userService, CloudService.Infrastructure.Data.ApplicationDbContext context)
        {
            _userService = userService;
            _context = context;
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetMyProfile()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var user = await _userService.GetUserByIdAsync(userId);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpPut("me/profile")]
        [Authorize]
        public async Task<IActionResult> UpdateMyProfile([FromBody] UpdateProfileDto dto)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var success = await _userService.UpdateProfileAsync(userId, dto);
            if (!success) return BadRequest(new { message = "Cập nhật thất bại." });
            return Ok(new { message = "Cập nhật thông tin thành công." });
        }

        [HttpPut("me/password")]
        [Authorize]
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
        [Authorize]
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

        [HttpGet("vip")]
        [AllowAnonymous]
        public async Task<IActionResult> GetTopVipCustomers([FromQuery] int limit = 3)
        {
            var usersWithSpending = _context.AppUsers
                .Where(u => u.IsActive && u.Company != null)
                .Select(u => new
                {
                    u.Id,
                    u.FullName,
                    u.Company,
                    u.AvatarUrl,
                    TotalSpending = u.Orders.Where(o => o.Status == CloudService.Domain.Enums.OrderStatus.Completed).Sum(o => o.TotalAmount),
                    TopPlan = u.Orders.Where(o => o.Status == CloudService.Domain.Enums.OrderStatus.Completed)
                                      .OrderByDescending(o => o.TotalAmount)
                                      .Select(o => o.ServicePlan.Name)
                                      .FirstOrDefault()
                })
                .Where(u => u.TotalSpending > 0)
                .OrderByDescending(u => u.TotalSpending)
                .Take(limit)
                .ToList();

            return Ok(usersWithSpending);
        }

        [HttpPost("seed-vip")]
        [AllowAnonymous]
        public async Task<IActionResult> SeedVipData()
        {
            // Seed 3 Users
            var role = _context.Roles.FirstOrDefault(r => r.Name == "Customer");
            if (role == null) return BadRequest("Customer role not found");

            var users = new List<CloudService.Domain.Entities.AppUser>
            {
                new CloudService.Domain.Entities.AppUser
                {
                    FullName = "Nguyễn Văn A",
                    Email = "nguyenvana@techcore.vn",
                    Company = "TechCore Vietnam",
                    AvatarUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDFXW_lRzyL1X9Z8mY_hX3fQ3_XlX6XvKkL_K8K9L_L8L9K_K8L9K_K8L9K",
                    RoleId = role.Id
                },
                new CloudService.Domain.Entities.AppUser
                {
                    FullName = "Trần Thị B",
                    Email = "tranthib@dataflow.corp",
                    Company = "DataFlow Corp",
                    AvatarUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDFXW_lRzyL1X9Z8mY_hX3fQ3_XlX6XvKkL_K8K9L_L8L9K_K8L9K_K8L9K",
                    RoleId = role.Id
                },
                new CloudService.Domain.Entities.AppUser
                {
                    FullName = "Lê Hoàng C",
                    Email = "lehoangc@fintech.asia",
                    Company = "Fintech Asia",
                    AvatarUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDFXW_lRzyL1X9Z8mY_hX3fQ3_XlX6XvKkL_K8K9L_L8L9K_K8L9K_K8L9K",
                    RoleId = role.Id
                }
            };
            _context.AppUsers.AddRange(users);
            await _context.SaveChangesAsync();

            // Seed Orders
            var plans = _context.ServicePlans.ToList();
            var planMax = plans.FirstOrDefault(p => p.Name.Contains("Enterprise")) ?? plans.First();
            var planGPU = plans.FirstOrDefault(p => p.Name.Contains("Business")) ?? plans.First();
            var planPro = plans.FirstOrDefault(p => p.Name.Contains("Pro")) ?? plans.First();

            var priceMax = _context.PlanPrices.FirstOrDefault(p => p.ServicePlanId == planMax.Id);
            var priceGPU = _context.PlanPrices.FirstOrDefault(p => p.ServicePlanId == planGPU.Id);
            var pricePro = _context.PlanPrices.FirstOrDefault(p => p.ServicePlanId == planPro.Id);

            var orders = new List<CloudService.Domain.Entities.OrderRequest>
            {
                new CloudService.Domain.Entities.OrderRequest { UserId = users[0].Id, ServicePlanId = planMax.Id, PlanPriceId = priceMax.Id, TotalAmount = 150000000, Status = CloudService.Domain.Enums.OrderStatus.Completed },
                new CloudService.Domain.Entities.OrderRequest { UserId = users[1].Id, ServicePlanId = planGPU.Id, PlanPriceId = priceGPU.Id, TotalAmount = 120000000, Status = CloudService.Domain.Enums.OrderStatus.Completed },
                new CloudService.Domain.Entities.OrderRequest { UserId = users[2].Id, ServicePlanId = planPro.Id, PlanPriceId = pricePro.Id, TotalAmount = 95000000, Status = CloudService.Domain.Enums.OrderStatus.Completed }
            };
            _context.OrderRequests.AddRange(orders);
            await _context.SaveChangesAsync();

            // Seed Reviews
            var reviews = new List<CloudService.Domain.Entities.CustomerReview>
            {
                new CloudService.Domain.Entities.CustomerReview
                {
                    ReviewerName = "Phạm D",
                    ReviewerTitle = "CTO tại TechCore",
                    ReviewerAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuB0JBkk4hHmiPwFYHwgF3KNsUDFFNcPcGaCWm7KckVzCGeTs7iyNXIpBYG6DBHBFYQP8nTEXzDHu-DAEqStbkVLfyLjLWviR_-16Q6We9VgoNtSKdcgLBcwE6eAXWByIBZnNwtWm3uxt3N9urYD0RcNR22EQw1ACqz8Xn2zmFHZxSEwZrUlCs7y5LawNwEFuOxK-vl0_ltWm_K21GraYkTRPzyWDuOBE3LT0I2n5aBhp1gRwwE5w7De",
                    Rating = 5,
                    Content = "Hạ tầng của CloudNova cực kỳ ổn định. Từ khi chuyển đổi, tốc độ tải trang của chúng tôi tăng 40%.",
                    SortOrder = 1
                },
                new CloudService.Domain.Entities.CustomerReview
                {
                    ReviewerName = "Vũ E",
                    ReviewerTitle = "Founder of DataFlow",
                    ReviewerAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuB0JBkk4hHmiPwFYHwgF3KNsUDFFNcPcGaCWm7KckVzCGeTs7iyNXIpBYG6DBHBFYQP8nTEXzDHu-DAEqStbkVLfyLjLWviR_-16Q6We9VgoNtSKdcgLBcwE6eAXWByIBZnNwtWm3uxt3N9urYD0RcNR22EQw1ACqz8Xn2zmFHZxSEwZrUlCs7y5LawNwEFuOxK-vl0_ltWm_K21GraYkTRPzyWDuOBE3LT0I2n5aBhp1gRwwE5w7De",
                    Rating = 5,
                    Content = "Dịch vụ hỗ trợ 24/7 vô cùng chuyên nghiệp. Các sự cố được giải quyết gần như ngay lập tức, rất đáng tin cậy.",
                    SortOrder = 2
                },
                new CloudService.Domain.Entities.CustomerReview
                {
                    ReviewerName = "Ngô F",
                    ReviewerTitle = "Giám đốc Hạ tầng, VinTech",
                    ReviewerAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuB0JBkk4hHmiPwFYHwgF3KNsUDFFNcPcGaCWm7KckVzCGeTs7iyNXIpBYG6DBHBFYQP8nTEXzDHu-DAEqStbkVLfyLjLWviR_-16Q6We9VgoNtSKdcgLBcwE6eAXWByIBZnNwtWm3uxt3N9urYD0RcNR22EQw1ACqz8Xn2zmFHZxSEwZrUlCs7y5LawNwEFuOxK-vl0_ltWm_K21GraYkTRPzyWDuOBE3LT0I2n5aBhp1gRwwE5w7De",
                    Rating = 4.5M,
                    Content = "VPS GPU xử lý các model AI của chúng tôi rất mượt mà. Chi phí hợp lý so với hiệu năng mang lại.",
                    SortOrder = 3
                },
                new CloudService.Domain.Entities.CustomerReview
                {
                    ReviewerName = "Lý G",
                    ReviewerTitle = "CEO tại StartUpX",
                    ReviewerAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuB0JBkk4hHmiPwFYHwgF3KNsUDFFNcPcGaCWm7KckVzCGeTs7iyNXIpBYG6DBHBFYQP8nTEXzDHu-DAEqStbkVLfyLjLWviR_-16Q6We9VgoNtSKdcgLBcwE6eAXWByIBZnNwtWm3uxt3N9urYD0RcNR22EQw1ACqz8Xn2zmFHZxSEwZrUlCs7y5LawNwEFuOxK-vl0_ltWm_K21GraYkTRPzyWDuOBE3LT0I2n5aBhp1gRwwE5w7De",
                    Rating = 5,
                    Content = "Hệ thống quản lý dễ sử dụng, tôi có thể tự mình thiết lập máy chủ chỉ trong 5 phút. Rất hài lòng!",
                    SortOrder = 4
                }
            };
            _context.CustomerReviews.AddRange(reviews);
            await _context.SaveChangesAsync();

            return Ok("Seeded successfully");
        }

        [HttpGet("reviews")]
        [AllowAnonymous]
        public async Task<IActionResult> GetReviews([FromQuery] int page = 1, [FromQuery] int pageSize = 3)
        {
            var query = _context.CustomerReviews.Where(r => r.IsVisible).OrderBy(r => r.SortOrder);
            var totalCount = query.Count();
            var items = query.Skip((page - 1) * pageSize).Take(pageSize).ToList();
            
            return Ok(new
            {
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                HasNextPage = (page * pageSize) < totalCount,
                Items = items
            });
        }

        [HttpPost("reviews")]
        public async Task<IActionResult> CreateReview([FromBody] CloudService.Application.DTOs.Users.CreateReviewDto dto)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var user = await _context.AppUsers.FindAsync(userId);
            if (user == null) return NotFound("User not found");

            // Option: Verify if OrderId belongs to user and is Completed
            if (dto.OrderId.HasValue)
            {
                var order = await _context.OrderRequests.FindAsync(dto.OrderId.Value);
                if (order == null || order.UserId != userId || order.Status != CloudService.Domain.Enums.OrderStatus.Completed)
                {
                    return BadRequest("Bạn chỉ có thể đánh giá những đơn hàng đã hoàn thành của mình.");
                }

                // Check if already reviewed
                var existingReview = _context.CustomerReviews.FirstOrDefault(r => r.OrderId == dto.OrderId.Value);
                if (existingReview != null)
                {
                    return BadRequest("Bạn đã đánh giá đơn hàng này rồi.");
                }
            }

            var review = new CloudService.Domain.Entities.CustomerReview
            {
                UserId = userId,
                OrderId = dto.OrderId,
                Rating = dto.Rating,
                Content = dto.Content,
                ReviewerName = user.FullName,
                ReviewerTitle = user.Company ?? "Khách hàng",
                ReviewerAvatar = user.AvatarUrl ?? "https://ui-avatars.com/api/?name=" + Uri.EscapeDataString(user.FullName),
                IsVisible = true, // Auto visible for simplicity, could be false to require admin approval
                SortOrder = 0
            };

            _context.CustomerReviews.Add(review);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cảm ơn bạn đã gửi đánh giá!" });
        }
    }
}
