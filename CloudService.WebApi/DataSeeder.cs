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
        }
    }
}
