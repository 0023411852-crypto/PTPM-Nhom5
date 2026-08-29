using CloudService.Domain.Entities;
using CloudService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CloudService.WebApi
{
    public static class DataSeeder
    {
        public static void SeedData(ApplicationDbContext context)
        {
            // Note: Schema modifications (ALTER TABLE) have been removed. They are handled by EF Core Migrations.
            // Raw SQL seeding logic has been moved to the standalone 'Seeder' project.
            // This method is kept for potential future use (e.g. basic admin initialization using EF Core).
            
            // Ép buộc reset lại mật khẩu admin thành 123456 mỗi khi khởi động
            // Để khắc phục triệt để lỗi sai hash mật khẩu trong file seed
            var adminUser = context.AppUsers.FirstOrDefault(u => u.Email == "admin@cloudservice.vn");
            if (adminUser != null)
            {
                adminUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456");
                context.SaveChanges();
                Console.WriteLine("[DataSeeder] Tự động cập nhật mật khẩu admin về 123456 thành công.");
            }
        }
    }
}
