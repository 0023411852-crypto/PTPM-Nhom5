using CloudService.Domain.Entities;
using CloudService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CloudService.WebApi
{
    public static class DataSeeder
    {
        public static void SeedData(ApplicationDbContext context)
        {
            if (!context.Roles.Any())
            {
                var adminRole = new Role { Id = Guid.NewGuid(), Name = "Admin" };
                var userRole = new Role { Id = Guid.NewGuid(), Name = "User" };
                context.Roles.AddRange(adminRole, userRole);
                context.SaveChanges();
            }

            if (!context.AppUsers.Any(u => u.Email == "admin@ptpm-nhom5.com"))
            {
                var adminRole = context.Roles.FirstOrDefault(r => r.Name == "Admin");
                if (adminRole != null)
                {
                    var adminUser = new AppUser
                    {
                        Id = Guid.NewGuid(),
                        FullName = "System Admin",
                        Email = "admin@ptpm-nhom5.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123!"),
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow,
                        RoleId = adminRole.Id
                    };
                    context.AppUsers.Add(adminUser);
                    context.SaveChanges();
                }
            }
        }
    }
}
