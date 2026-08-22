using CloudService.Domain.Common;

namespace CloudService.Domain.Entities
{
    public class TicketReply : BaseEntity
    {
        public Guid TicketId { get; set; }
        public Guid UserId { get; set; }
        public string Message { get; set; } = string.Empty;

        public virtual SupportTicket Ticket { get; set; } = null!;
        public virtual AppUser User { get; set; } = null!;
    }
}
