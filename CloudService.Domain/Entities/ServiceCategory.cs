using System.ComponentModel.DataAnnotations;
using CloudService.Domain.Common;

namespace CloudService.Domain.Entities
{
    public class ServiceCategory : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        [MaxLength(200)]
        public string DetailTitle { get; set; } = string.Empty;
        [MaxLength(50)]
        public string Icon { get; set; } = "dns";
        public string FeaturesJson { get; set; } = "[]";
        public string Slug { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;

        public virtual ICollection<ServicePlan> ServicePlans { get; set; } = new List<ServicePlan>();
        public virtual ICollection<ServiceFeature> ServiceFeatures { get; set; } = new List<ServiceFeature>();
    }
}
