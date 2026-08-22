using CloudService.Domain.Common;

namespace CloudService.Domain.Entities
{
    public class UserSession : BaseEntity
    {
        public Guid UserId { get; set; }
        public virtual AppUser User { get; set; } = null!;

        public string RefreshTokenHash { get; set; } = string.Empty;
        public DateTime LastActiveTimestamp { get; set; }
        public DateTime ExpiresAt { get; set; }
        public bool IsRevoked { get; set; }
    }
}
