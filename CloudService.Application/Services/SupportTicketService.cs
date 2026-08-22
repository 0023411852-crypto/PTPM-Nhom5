using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CloudService.Application.Common;
using CloudService.Application.DTOs.SupportTickets;
using CloudService.Application.Interfaces;
using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;

namespace CloudService.Application.Services
{
    public class SupportTicketService : ISupportTicketService
    {
        private readonly IGenericRepository<SupportTicket> _ticketRepository;
        private readonly IGenericRepository<TicketReply> _replyRepository;
        private readonly IMapper _mapper;
        private readonly IEventDispatcher _eventDispatcher;

        public SupportTicketService(
            IGenericRepository<SupportTicket> ticketRepository,
            IGenericRepository<TicketReply> replyRepository,
            IMapper mapper,
            IEventDispatcher eventDispatcher)
        {
            _ticketRepository = ticketRepository;
            _replyRepository = replyRepository;
            _mapper = mapper;
            _eventDispatcher = eventDispatcher;
        }

        public async Task<PagedResponse<SupportTicketDto>> GetAllTicketsAsync(PaginationFilter filter)
        {
            var allTickets = await _ticketRepository.GetAllAsync(includeProperties: "Replies");
            var totalCount = allTickets.Count();

            var paginatedItems = allTickets
                .OrderByDescending(x => x.CreatedAt)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToList();

            var dtos = _mapper.Map<List<SupportTicketDto>>(paginatedItems);
            return new PagedResponse<SupportTicketDto>(dtos, totalCount, filter.PageNumber, filter.PageSize);
        }

        public async Task<PagedResponse<SupportTicketDto>> GetMyTicketsAsync(Guid customerId, PaginationFilter filter)
        {
            var allTickets = await _ticketRepository.GetAllAsync(includeProperties: "Replies");
            var myTickets = allTickets.Where(x => x.CustomerId == customerId).ToList();
            
            var totalCount = myTickets.Count;

            var paginatedItems = myTickets
                .OrderByDescending(x => x.CreatedAt)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToList();

            var dtos = _mapper.Map<List<SupportTicketDto>>(paginatedItems);

            return new PagedResponse<SupportTicketDto>(dtos, totalCount, filter.PageNumber, filter.PageSize);
        }

        public async Task<SupportTicketDto?> GetTicketByIdAsync(Guid id, Guid? customerId = null)
        {
            var allTickets = await _ticketRepository.GetAllAsync(includeProperties: "Replies");
            var entity = customerId.HasValue 
                ? allTickets.FirstOrDefault(x => x.Id == id && x.CustomerId == customerId.Value)
                : allTickets.FirstOrDefault(x => x.Id == id);
                
            if (entity == null) return null;
            return _mapper.Map<SupportTicketDto>(entity);
        }

        public async Task<SupportTicketDto> CreateTicketAsync(Guid customerId, CreateSupportTicketDto dto)
        {
            var ticket = new SupportTicket
            {
                CustomerId = customerId,
                Title = dto.Title,
                Description = dto.Description,
                Status = "Open"
            };

            await _ticketRepository.AddAsync(ticket);
            await _eventDispatcher.DispatchAsync(new CloudService.Domain.Events.SupportTicketCreatedEvent(customerId, ticket.Id, ticket.Title));

            return _mapper.Map<SupportTicketDto>(ticket);
        }

        public async Task<TicketReplyDto> ReplyToTicketAsync(Guid userId, Guid ticketId, CreateTicketReplyDto dto, bool isAdmin)
        {
            var ticket = await _ticketRepository.GetByIdAsync(ticketId);
            if (ticket == null) throw new Exception("Ticket not found");
            
            if (!isAdmin && ticket.CustomerId != userId)
            {
                throw new UnauthorizedAccessException("You don't have access to this ticket.");
            }

            var reply = new TicketReply
            {
                TicketId = ticketId,
                UserId = userId,
                Message = dto.Message
            };

            await _replyRepository.AddAsync(reply);
            return _mapper.Map<TicketReplyDto>(reply);
        }

        public async Task<bool> CloseTicketAsync(Guid ticketId)
        {
            var ticket = await _ticketRepository.GetByIdAsync(ticketId);
            if (ticket == null) return false;
            
            ticket.Status = "Closed";
            _ticketRepository.Update(ticket);
            return true;
        }
    }
}
