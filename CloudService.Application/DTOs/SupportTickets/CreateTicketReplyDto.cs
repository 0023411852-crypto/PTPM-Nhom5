using System.ComponentModel.DataAnnotations;

namespace CloudService.Application.DTOs.SupportTickets
{
    public class CreateTicketReplyDto
    {
        [Required]
        public string Message { get; set; } = string.Empty;
    }
}
