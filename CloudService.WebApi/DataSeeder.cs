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

            // Ép buộc reset lại mật khẩu admin thành 123456 mỗi khi khởi động
            // Để khắc phục triệt để lỗi sai hash mật khẩu trong file seed
            var adminUser = context.AppUsers.FirstOrDefault(u => u.Email == "admin@cloudservice.vn");
            if (adminUser != null)
            {
                adminUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456");
                context.SaveChanges();
                Console.WriteLine("[DataSeeder] Tự động cập nhật mật khẩu admin về 123456 thành công.");
            }

            // Auto-run raw SQL seed files if database is empty (no categories)
            if (!context.ServiceCategories.Any())
            {
                try
                {
                    Console.WriteLine("[DataSeeder] Database is empty. Running seed_data_database_script_1.sql...");
                    var seedDataPath = Path.Combine(Directory.GetCurrentDirectory(), "seed_data_database_script_1.sql");
                    if (File.Exists(seedDataPath))
                    {
                        var sql = File.ReadAllText(seedDataPath);
                        // Execute raw SQL script. Note: GO batches are not supported directly by ExecuteSqlRaw, 
                        // so we need to split by GO or assume the script is clean.
                        // For simplicity, we split the script by 'GO' commands.
                        var commands = sql.Split(new[] { "GO\r\n", "GO\n", "GO " }, StringSplitOptions.RemoveEmptyEntries);
                        foreach (var command in commands)
                        {
                            if (!string.IsNullOrWhiteSpace(command))
                            {
                                context.Database.ExecuteSqlRaw(command);
                            }
                        }
                        Console.WriteLine("[DataSeeder] Successfully executed seed_data_database_script_1.sql.");
                    }
                    else
                    {
                        Console.WriteLine($"[DataSeeder] File not found: {seedDataPath}");
                    }

                    Console.WriteLine("[DataSeeder] Running update_categories.sql...");
                    var updateCategoriesPath = Path.Combine(Directory.GetCurrentDirectory(), "update_categories.sql");
                    if (File.Exists(updateCategoriesPath))
                    {
                        var sql = File.ReadAllText(updateCategoriesPath);
                        var commands = sql.Split(new[] { "GO\r\n", "GO\n", "GO " }, StringSplitOptions.RemoveEmptyEntries);
                        foreach (var command in commands)
                        {
                            if (!string.IsNullOrWhiteSpace(command))
                            {
                                context.Database.ExecuteSqlRaw(command);
                            }
                        }
                        Console.WriteLine("[DataSeeder] Successfully executed update_categories.sql.");
                    }
                    else
                    {
                        Console.WriteLine($"[DataSeeder] File not found: {updateCategoriesPath}");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("[DataSeeder] Error executing SQL seed scripts: " + ex.Message);
                }
            }
        }
    }
}
