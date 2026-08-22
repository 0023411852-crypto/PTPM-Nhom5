using CloudService.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace CloudService.Domain.Entities
{
    public class MediaFile : BaseEntity
    {
        [Required]
        [MaxLength(255)]
        public string FileName { get; set; } = string.Empty;

        [Required]
        public string FileUrl { get; set; } = string.Empty;

        [MaxLength(50)]
        public string FileSize { get; set; } = string.Empty;

        [MaxLength(50)]
        public string FileType { get; set; } = string.Empty; // e.g. "Hình ảnh", "Video", "Tài liệu"
    }
}
