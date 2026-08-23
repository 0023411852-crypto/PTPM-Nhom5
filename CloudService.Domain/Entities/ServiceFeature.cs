using System.ComponentModel.DataAnnotations;
using CloudService.Domain.Common;

namespace CloudService.Domain.Entities
{
    public class ServiceFeature : BaseEntity
    {
        public Guid ServiceCategoryId { get; set; }
        public virtual ServiceCategory Category { get; set; } = null!;

        [MaxLength(255)]
        public string Name { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;
        public int DisplayOrder { get; set; } = 0;
    }
}
