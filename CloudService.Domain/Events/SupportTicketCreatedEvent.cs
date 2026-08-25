using System;

namespace CloudService.Domain.Events
{
    public class SupportTicketCreatedEvent : IDomainEvent
    {
        public Guid UserId { get; set; }
        public Guid TicketId { get; set; }
        public string Title { get; set; }
        public DateTime Timestamp { get; set; }

        public SupportTicketCreatedEvent(Guid userId, Guid ticketId, string title)
        {
            UserId = userId;
            TicketId = ticketId;
            Title = title;
            Timestamp = DateTime.UtcNow;
        }
    }
}
