using CloudService.Domain.Common;

namespace CloudService.Domain.Entities
{
    public class NewsletterSubscriber : BaseEntity
    {
        public string Email { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
    }
}
