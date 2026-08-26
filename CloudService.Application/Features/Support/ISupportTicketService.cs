using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CloudService.Application.Common;
using CloudService.Application.DTOs.SupportTickets;

namespace CloudService.Application.Interfaces
{
    public interface ISupportTicketService
    {
        Task<PagedResponse<SupportTicketDto>> GetAllTicketsAsync(PaginationFilter filter);
        Task<PagedResponse<SupportTicketDto>> GetMyTicketsAsync(Guid customerId, PaginationFilter filter);
        Task<SupportTicketDto?> GetTicketByIdAsync(Guid id, Guid? customerId = null);
        Task<SupportTicketDto> CreateTicketAsync(Guid customerId, CreateSupportTicketDto dto);
        Task<TicketReplyDto> ReplyToTicketAsync(Guid userId, Guid ticketId, CreateTicketReplyDto dto, bool isAdmin);
        Task<bool> CloseTicketAsync(Guid ticketId);
    }
}
