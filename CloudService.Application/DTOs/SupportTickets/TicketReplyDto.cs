using System;

namespace CloudService.Application.DTOs.SupportTickets
{
    public class TicketReplyDto
    {
        public Guid Id { get; set; }
        public Guid TicketId { get; set; }
        public Guid UserId { get; set; }
        public string Message { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
