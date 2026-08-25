using CloudService.Domain.Common;

namespace CloudService.Domain.Entities
{
    public class CustomerReview : BaseEntity
    {
        public string ReviewerName { get; set; } = string.Empty;
        public string ReviewerTitle { get; set; } = string.Empty;
        public string ReviewerAvatar { get; set; } = string.Empty;
        public decimal Rating { get; set; }
        public string Content { get; set; } = string.Empty;
        public bool IsVisible { get; set; } = true;
        public int SortOrder { get; set; } = 0;
        
        public Guid? UserId { get; set; }
        public Guid? OrderId { get; set; }
    }
}
