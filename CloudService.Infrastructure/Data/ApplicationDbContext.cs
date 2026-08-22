using CloudService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CloudService.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<AppUser> AppUsers { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<ServiceCategory> ServiceCategories { get; set; }
        public DbSet<ServicePlan> ServicePlans { get; set; }
        public DbSet<PlanPrice> PlanPrices { get; set; }
        public DbSet<Promotion> Promotions { get; set; }
        public DbSet<OrderRequest> OrderRequests { get; set; }
        public DbSet<NewsArticle> NewsArticles { get; set; }
        public DbSet<AffiliateApplication> AffiliateApplications { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Fluent API configurations
            modelBuilder.Entity<AppUser>(entity =>
            {
                entity.HasOne(e => e.Role)
                      .WithMany(r => r.Users)
                      .HasForeignKey(e => e.RoleId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<ServicePlan>(entity =>
            {
                entity.HasOne(e => e.Category)
                      .WithMany(c => c.ServicePlans)
                      .HasForeignKey(e => e.CategoryId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<PlanPrice>(entity =>
            {
                entity.HasOne(e => e.ServicePlan)
                      .WithMany(s => s.Prices)
                      .HasForeignKey(e => e.ServicePlanId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
                entity.Property(e => e.SetupFee).HasColumnType("decimal(18,2)");
            });

            modelBuilder.Entity<Promotion>(entity =>
            {
                entity.HasOne(e => e.ServicePlan)
                      .WithMany(s => s.Promotions)
                      .HasForeignKey(e => e.ServicePlanId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.Property(e => e.DiscountPercentage).HasColumnType("decimal(5,2)");
            });

            modelBuilder.Entity<OrderRequest>(entity =>
            {
                entity.Property(e => e.TotalAmount).HasColumnType("decimal(18,2)");
                
                entity.HasOne(e => e.User)
                      .WithMany(u => u.Orders)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Restrict);
                      
                entity.HasOne(e => e.ServicePlan)
                      .WithMany()
                      .HasForeignKey(e => e.ServicePlanId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.PlanPrice)
                      .WithMany()
                      .HasForeignKey(e => e.PlanPriceId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Promotion)
                      .WithMany()
                      .HasForeignKey(e => e.PromotionId)
                      .OnDelete(DeleteBehavior.SetNull);
            });
            
            modelBuilder.Entity<NewsArticle>(entity =>
            {
                entity.HasOne(e => e.Author)
                      .WithMany()
                      .HasForeignKey(e => e.AuthorId)
                      .OnDelete(DeleteBehavior.Restrict);
            });
            
            modelBuilder.Entity<AffiliateApplication>(entity =>
            {
                entity.HasOne(e => e.User)
                      .WithMany()
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Restrict);
            });
            
            modelBuilder.Entity<AuditLog>(entity =>
            {
                entity.HasOne(e => e.User)
                      .WithMany()
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
