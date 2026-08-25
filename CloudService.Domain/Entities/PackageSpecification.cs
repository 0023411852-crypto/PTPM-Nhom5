using System.ComponentModel.DataAnnotations;
using CloudService.Domain.Common;

namespace CloudService.Domain.Entities
{
    public class PackageSpecification : BaseEntity
    {
        public Guid ServicePlanId { get; set; }
        public virtual ServicePlan ServicePlan { get; set; } = null!;

        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(255)]
        public string Value { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Unit { get; set; } = string.Empty;

        public int DisplayOrder { get; set; } = 0;
    }
}
