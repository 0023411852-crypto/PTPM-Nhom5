using CloudService.Domain.Common;

namespace CloudService.Domain.Entities
{
    public class ServicePlan : BaseEntity
    {
        public Guid CategoryId { get; set; }
        public virtual ServiceCategory Category { get; set; } = null!;

        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Specifications { get; set; } = string.Empty; // JSON format for specs
        public string? QRCodeBase64 { get; set; }
        public bool IsActive { get; set; } = true;

        public virtual ICollection<PlanPrice> Prices { get; set; } = new List<PlanPrice>();
        public virtual ICollection<Promotion> Promotions { get; set; } = new List<Promotion>();
    }
}
