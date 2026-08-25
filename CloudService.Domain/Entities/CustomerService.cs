using CloudService.Domain.Common;

namespace CloudService.Domain.Entities
{
    public class CustomerService : BaseEntity
    {
        public Guid OrderId { get; set; }
        public Guid CustomerId { get; set; }
        
        public string ServiceName { get; set; } = string.Empty;
        public string VpsIP { get; set; } = string.Empty;
        public string VpsUser { get; set; } = string.Empty;
        public string VpsPassword { get; set; } = string.Empty;
        
        public DateTime ExpiryDate { get; set; }
        public string Status { get; set; } = "Active"; // Active, Suspended, Expired

        public virtual OrderRequest Order { get; set; } = null!;
        public virtual AppUser Customer { get; set; } = null!;
    }
}
