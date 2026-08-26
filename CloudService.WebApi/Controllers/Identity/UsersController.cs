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
            // This method currently uses synchronous IQueryable operations.
            await Task.CompletedTask;
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
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SeedVipData()
        {
            // Seed 3 Users (idempotent - check if users already exist)
            var role = _context.Roles.FirstOrDefault(r => r.Name == "Customer");
            if (role == null) return BadRequest("Customer role not found");

            var vipEmails = new[] { "nguyenvana@techcore.vn", "tranthib@dataflow.corp", "lehoangc@fintech.asia" };
            var existingUsers = _context.AppUsers.Where(u => vipEmails.Contains(u.Email)).ToList();
            
            if (existingUsers.Count == vipEmails.Length)
            {
                return Ok("VIP data already seeded");
            }

            var users = new List<CloudService.Domain.Entities.AppUser>();
            foreach (var email in vipEmails)
            {
                if (!existingUsers.Any(u => u.Email == email))
                {
                    if (email == "nguyenvana@techcore.vn")
                    {
                        users.Add(new CloudService.Domain.Entities.AppUser
                        {
                            FullName = "Nguyễn Văn A",
                            Email = email,
                            Company = "TechCore Vietnam",
                            AvatarUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDFXW_lRzyL1X9Z8mY_hX3fQ3_XlX6XvKkL_K8K9L_L8L9K_K8L9K_K8L9K",
                            RoleId = role.Id
                        });
                    }
                    else if (email == "tranthib@dataflow.corp")
                    {
                        users.Add(new CloudService.Domain.Entities.AppUser
                        {
                            FullName = "Trần Thị B",
                            Email = email,
                            Company = "DataFlow Corp",
                            AvatarUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDFXW_lRzyL1X9Z8mY_hX3fQ3_XlX6XvKkL_K8K9L_L8L9K_K8L9K_K8L9K",
                            RoleId = role.Id
                        });
                    }
                    else if (email == "lehoangc@fintech.asia")
                    {
                        users.Add(new CloudService.Domain.Entities.AppUser
                        {
                            FullName = "Lê Hoàng C",
                            Email = email,
                            Company = "Fintech Asia",
                            AvatarUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDFXW_lRzyL1X9Z8mY_hX3fQ3_XlX6XvKkL_K8K9L_L8L9K_K8L9K_K8L9K",
                            RoleId = role.Id
                        });
                    }
                }
            }

            if (users.Any())
            {
                _context.AppUsers.AddRange(users);
                await _context.SaveChangesAsync();
            }

            // Merge existing users with newly created users for order seeding
            var allVipUsers = existingUsers.Concat(users).ToList();
            var vipUserIds = allVipUsers.Select(u => u.Id).ToList();

            // Seed Orders (idempotent - check if orders already exist for these users)
            var plans = _context.ServicePlans.ToList();
            if (plans.Count == 0)
                return BadRequest("Không thể seed VIP data khi chưa có service plan.");

            var planMax = plans.FirstOrDefault(p => p.Name.Contains("Enterprise")) ?? plans.First();
            var planGPU = plans.FirstOrDefault(p => p.Name.Contains("Business")) ?? plans.First();
            var planPro = plans.FirstOrDefault(p => p.Name.Contains("Pro")) ?? plans.First();

            var priceMax = _context.PlanPrices.FirstOrDefault(p => p.ServicePlanId == planMax.Id);
            var priceGPU = _context.PlanPrices.FirstOrDefault(p => p.ServicePlanId == planGPU.Id);
            var pricePro = _context.PlanPrices.FirstOrDefault(p => p.ServicePlanId == planPro.Id);

            var existingOrders = _context.OrderRequests.Where(o => vipUserIds.Contains(o.UserId)).ToList();
            var ordersToCreate = new List<CloudService.Domain.Entities.OrderRequest>();
            
            // Find users by email to ensure correct mapping
            var userA = allVipUsers.FirstOrDefault(u => u.Email == "nguyenvana@techcore.vn");
            var userB = allVipUsers.FirstOrDefault(u => u.Email == "tranthib@dataflow.corp");
            var userC = allVipUsers.FirstOrDefault(u => u.Email == "lehoangc@fintech.asia");

            if (userA != null && !existingOrders.Any(o => o.UserId == userA.Id))
            {
                ordersToCreate.Add(new CloudService.Domain.Entities.OrderRequest { UserId = userA.Id, ServicePlanId = planMax.Id, PlanPriceId = priceMax!.Id, TotalAmount = 150000000, Status = CloudService.Domain.Enums.OrderStatus.Completed });
            }
            if (userB != null && !existingOrders.Any(o => o.UserId == userB.Id))
            {
                ordersToCreate.Add(new CloudService.Domain.Entities.OrderRequest { UserId = userB.Id, ServicePlanId = planGPU.Id, PlanPriceId = priceGPU!.Id, TotalAmount = 120000000, Status = CloudService.Domain.Enums.OrderStatus.Completed });
            }
            if (userC != null && !existingOrders.Any(o => o.UserId == userC.Id))
            {
                ordersToCreate.Add(new CloudService.Domain.Entities.OrderRequest { UserId = userC.Id, ServicePlanId = planPro.Id, PlanPriceId = pricePro!.Id, TotalAmount = 95000000, Status = CloudService.Domain.Enums.OrderStatus.Completed });
            }
            
            if (ordersToCreate.Any())
            {
                _context.OrderRequests.AddRange(ordersToCreate);
                await _context.SaveChangesAsync();
            }

            // Get the orders (either existing or newly created)
            var finalOrders = _context.OrderRequests.Where(o => vipUserIds.Contains(o.UserId)).ToList();

            // Seed Reviews (idempotent - check if reviews already exist by reviewer name)
            var existingReviews = _context.CustomerReviews.ToList();
            var reviewsToCreate = new List<CloudService.Domain.Entities.CustomerReview>();
            
            var reviewData = new[]
            {
                new { Name = "Phạm D", Title = "CTO tại TechCore", Rating = 5.0M, Content = "Hạ tầng của CloudNova cực kỳ ổn định. Từ khi chuyển đổi, tốc độ tải trang của chúng tôi tăng 40%.", SortOrder = 1 },
                new { Name = "Vũ E", Title = "Founder of DataFlow", Rating = 5.0M, Content = "Dịch vụ hỗ trợ 24/7 vô cùng chuyên nghiệp. Các sự cố được giải quyết gần như ngay lập tức, rất đáng tin cậy.", SortOrder = 2 },
                new { Name = "Ngô F", Title = "Giám đốc Hạ tầng, VinTech", Rating = 4.5M, Content = "VPS GPU xử lý các model AI của chúng tôi rất mượt mà. Chi phí hợp lý so với hiệu năng mang lại.", SortOrder = 3 },
                new { Name = "Lý G", Title = "CEO tại StartUpX", Rating = 5.0M, Content = "Hệ thống quản lý dễ sử dụng, tôi có thể tự mình thiết lập máy chủ chỉ trong 5 phút. Rất hài lòng!", SortOrder = 4 }
            };

            for (int i = 0; i < reviewData.Length && i < finalOrders.Count; i++)
            {
                var data = reviewData[i];
                if (!existingReviews.Any(r => r.ReviewerName == data.Name))
                {
                    reviewsToCreate.Add(new CloudService.Domain.Entities.CustomerReview
                    {
                        OrderId = finalOrders[i].Id,
                        UserId = finalOrders[i].UserId,
                        ReviewerName = data.Name,
                        ReviewerTitle = data.Title,
                        ReviewerAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuB0JBkk4hHmiPwFYHwgF3KNsUDFFNcPcGaCWm7KckVzCGeTs7iyNXIpBYG6DBHBFYQP8nTEXzDHu-DAEqStbkVLfyLjLWviR_-16Q6We9VgoNtSKdcgLBcwE6eAXWByIBZnNwtWm3uxt3N9urYD0RcNR22EQw1ACqz8Xn2zmFHZxSEwZrUlCs7y5LawNwEFuOxK-vl0_ltWm_K21GraYkTRPzyWDuOBE3LT0I2n5aBhp1gRwwE5w7De",
                        Rating = data.Rating,
                        Content = data.Content,
                        SortOrder = data.SortOrder
                    });
                }
            }
            
            if (reviewsToCreate.Any())
            {
                _context.CustomerReviews.AddRange(reviewsToCreate);
                await _context.SaveChangesAsync();
            }

            return Ok("Seeded successfully");
        }

    }
}
