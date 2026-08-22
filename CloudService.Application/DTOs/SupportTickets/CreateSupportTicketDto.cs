using System.ComponentModel.DataAnnotations;

namespace CloudService.Application.DTOs.SupportTickets
{
    public class CreateSupportTicketDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Description { get; set; } = string.Empty;
    }
}
