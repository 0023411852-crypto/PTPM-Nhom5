using CloudService.Domain.Common;

namespace CloudService.Domain.Entities
{
    public class AuditLog : BaseEntity
    {
        public Guid UserId { get; set; }
        public virtual AppUser User { get; set; } = null!;

        public string Action { get; set; } = string.Empty; // Login, UpdatePrice...
        public string EntityName { get; set; } = string.Empty;
        public string EntityId { get; set; } = string.Empty;
        public string Details { get; set; } = string.Empty; // JSON format
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
