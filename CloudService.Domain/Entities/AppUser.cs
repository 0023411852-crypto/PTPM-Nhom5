using CloudService.Domain.Common;

namespace CloudService.Domain.Entities
{
    public class AppUser : BaseEntity
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string? Company { get; set; }
        public string? AvatarUrl { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime? PendingDeletionAt { get; set; }
        
        public Guid RoleId { get; set; }
        public virtual Role Role { get; set; } = null!;

        public virtual ICollection<OrderRequest> Orders { get; set; } = new List<OrderRequest>();
    }
}
