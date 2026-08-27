using CloudService.Domain.Entities;
using CloudService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CloudService.WebApi
{
    public static class DataSeeder
    {
        public static void SeedData(ApplicationDbContext context)
        {
            try
            {
                context.Database.ExecuteSqlRaw(@"
                    IF NOT EXISTS (
                        SELECT * FROM sys.columns 
                        WHERE Name = N'BillingCycle' AND Object_ID = Object_ID(N'OrderRequests')
                    )
                    BEGIN
                        ALTER TABLE [OrderRequests] ADD [BillingCycle] INT NOT NULL DEFAULT 1;
                    END
                ");
            }
            catch (Exception ex)
            {
                Console.WriteLine("Warning: Could not alter OrderRequests table: " + ex.Message);
            }

            try
            {
                var columnExists = context.Database.SqlQueryRaw<int>(@"
                    SELECT COUNT(*) as Value
                    FROM sys.columns 
                    WHERE Name = N'ThumbnailUrl' AND Object_ID = Object_ID(N'NewsArticles')
                ").FirstOrDefault();

                Console.WriteLine($"[DataSeeder] ThumbnailUrl column exists? {columnExists > 0}");

                if (columnExists == 0)
                {
                    Console.WriteLine("[DataSeeder] Adding ThumbnailUrl column to NewsArticles...");
                    context.Database.ExecuteSqlRaw("ALTER TABLE [NewsArticles] ADD [ThumbnailUrl] nvarchar(max) NULL;");
                    Console.WriteLine("[DataSeeder] Column added successfully.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Warning: Could not alter NewsArticles table: " + ex.Message);
            }

            if (!context.Roles.Any())
            {
                var adminRole = new Role { Id = Guid.NewGuid(), Name = "Admin" };
                var userRole = new Role { Id = Guid.NewGuid(), Name = "User" };
                context.Roles.AddRange(adminRole, userRole);
                context.SaveChanges();
            }

            if (!context.AppUsers.Any(u => u.Email == "admin@cloudservice.vn"))
            {
                var adminRole = context.Roles.FirstOrDefault(r => r.Name == "Admin");
                if (adminRole != null)
                {
                    var adminUser = new AppUser
                    {
                        Id = Guid.NewGuid(),
                        FullName = "System Admin",
                        Email = "admin@cloudservice.vn",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
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
