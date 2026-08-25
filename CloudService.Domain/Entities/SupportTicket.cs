using CloudService.Domain.Common;

namespace CloudService.Domain.Entities
{
    public class SupportTicket : BaseEntity
    {
        public Guid CustomerId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = "Open"; // Open, Closed, Pending

        public virtual AppUser Customer { get; set; } = null!;
        public virtual ICollection<TicketReply> Replies { get; set; } = new List<TicketReply>();
    }
}
