using System;
using System.Collections.Generic;

namespace CloudService.Application.DTOs.SupportTickets
{
    public class SupportTicketDto
    {
        public Guid Id { get; set; }
        public Guid CustomerId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = "Open";
        public DateTime CreatedAt { get; set; }
        
        public List<TicketReplyDto> Replies { get; set; } = new List<TicketReplyDto>();
    }
}
