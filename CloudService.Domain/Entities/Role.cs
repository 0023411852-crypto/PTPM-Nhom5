using CloudService.Domain.Common;

namespace CloudService.Domain.Entities
{
    public class Role : BaseEntity
    {
        public string Name { get; set; } = string.Empty; // Admin, Editor, Customer
        public virtual ICollection<AppUser> Users { get; set; } = new List<AppUser>();
    }
}
