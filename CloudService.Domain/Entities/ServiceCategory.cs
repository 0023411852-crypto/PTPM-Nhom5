using CloudService.Domain.Common;

namespace CloudService.Domain.Entities
{
    public class ServiceCategory : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;

        public virtual ICollection<ServicePlan> ServicePlans { get; set; } = new List<ServicePlan>();
    }
}
