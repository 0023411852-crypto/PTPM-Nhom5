using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CloudService.Application.Common;
using CloudService.Application.DTOs.SupportTickets;
using CloudService.Application.Interfaces;
using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;
using CloudService.Domain.Exceptions;

namespace CloudService.Application.Services
{
    public class SupportTicketService : ISupportTicketService
    {
        private readonly IGenericRepository<SupportTicket> _ticketRepository;
        private readonly IGenericRepository<TicketReply> _replyRepository;
        private readonly IMapper _mapper;
        private readonly IEventDispatcher _eventDispatcher;
        private readonly IUnitOfWork _unitOfWork;

        public SupportTicketService(
            IGenericRepository<SupportTicket> ticketRepository,
            IGenericRepository<TicketReply> replyRepository,
            IMapper mapper,
            IEventDispatcher eventDispatcher,
            IUnitOfWork unitOfWork)
        {
            _ticketRepository = ticketRepository;
            _replyRepository = replyRepository;
            _mapper = mapper;
            _eventDispatcher = eventDispatcher;
            _unitOfWork = unitOfWork;
        }

        public async Task<PagedResponse<SupportTicketDto>> GetAllTicketsAsync(PaginationFilter filter)
        {
            var totalCount = await _ticketRepository.CountAsync(query => query);
            var paginatedItems = await _ticketRepository.ToListAsync(query => query
                .OrderByDescending(x => x.CreatedAt)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize), "Customer");

            var dtos = _mapper.Map<List<SupportTicketDto>>(paginatedItems);
            return new PagedResponse<SupportTicketDto>(dtos, totalCount, filter.PageNumber, filter.PageSize);
        }

        public async Task<PagedResponse<SupportTicketDto>> GetMyTicketsAsync(Guid customerId, PaginationFilter filter)
        {
            var totalCount = await _ticketRepository.CountAsync(query => query.Where(x => x.CustomerId == customerId));
            var paginatedItems = await _ticketRepository.ToListAsync(query => query
                .Where(x => x.CustomerId == customerId)
                .OrderByDescending(x => x.CreatedAt)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize), "Customer");

            var dtos = _mapper.Map<List<SupportTicketDto>>(paginatedItems);
            return new PagedResponse<SupportTicketDto>(dtos, totalCount, filter.PageNumber, filter.PageSize);
        }

        public async Task<SupportTicketDto?> GetTicketByIdAsync(Guid id, Guid? customerId = null)
        {
            var entities = await _ticketRepository.ToListAsync(query => customerId.HasValue
                ? query.Where(x => x.Id == id && x.CustomerId == customerId.Value)
                : query.Where(x => x.Id == id), "Customer");
            var entity = entities.FirstOrDefault();
            return entity == null ? null : _mapper.Map<SupportTicketDto>(entity);
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
            await _unitOfWork.SaveChangesAsync();
            await _eventDispatcher.DispatchAsync(new CloudService.Domain.Events.SupportTicketCreatedEvent(customerId, ticket.Id, ticket.Title));

            return _mapper.Map<SupportTicketDto>(ticket);
        }

        public async Task<TicketReplyDto> ReplyToTicketAsync(Guid userId, Guid ticketId, CreateTicketReplyDto dto, bool isAdmin)
        {
            var ticket = await _ticketRepository.GetByIdAsync(ticketId);
            if (ticket == null) throw new NotFoundException("Ticket not found");
            
            if (!isAdmin && ticket.CustomerId != userId)
            {
                throw new UnauthorizedAccessException("You don't have access to this ticket.");
            }

            // Prevent replying to closed tickets
            if (ticket.Status == "Closed")
            {
                throw new ValidationException("Không thể trả lời ticket đã đóng.");
            }

            var reply = new TicketReply
            {
                TicketId = ticketId,
                UserId = userId,
                Message = dto.Message
            };

            await _replyRepository.AddAsync(reply);
            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<TicketReplyDto>(reply);
        }

        public async Task<bool> CloseTicketAsync(Guid ticketId)
        {
            var ticket = await _ticketRepository.GetByIdAsync(ticketId);
            if (ticket == null) return false;
            
            ticket.Status = "Closed";
            _ticketRepository.Update(ticket);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
    }
}
