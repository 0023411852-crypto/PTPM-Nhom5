using CloudService.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace CloudService.Domain.Entities
{
    public class StaticPage : BaseEntity
    {
        [Required]
        [MaxLength(255)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        public string Slug { get; set; } = string.Empty;

        public string Content { get; set; } = string.Empty;

        public bool IsPublished { get; set; } = false;

        public Guid AuthorId { get; set; }
        public virtual AppUser Author { get; set; } = null!;
    }
}
