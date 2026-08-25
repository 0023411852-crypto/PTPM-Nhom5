using CloudService.Domain.Entities;
using CloudService.Domain.Events;
using CloudService.Domain.Interfaces;
using System.Text.Json;

namespace CloudService.Application.EventHandlers
{
    public class AuditLogEventHandler : 
        IEventHandler<UserRegisteredEvent>,
        IEventHandler<UserLoggedInEvent>,
        IEventHandler<UserLoggedOutEvent>,
        IEventHandler<PasswordChangedEvent>,
        IEventHandler<UserLockedEvent>,
        IEventHandler<OrderPlacedEvent>,
        IEventHandler<SupportTicketCreatedEvent>
    {
        private readonly IUnitOfWork _unitOfWork;

        public AuditLogEventHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task HandleAsync(UserRegisteredEvent domainEvent)
        {
            await LogAsync(domainEvent.UserId, "REGISTER", "AppUser", domainEvent.UserId.ToString(), domainEvent);
        }

        public async Task HandleAsync(UserLoggedInEvent domainEvent)
        {
            await LogAsync(domainEvent.UserId, "LOGIN", "AppUser", domainEvent.UserId.ToString(), domainEvent);
        }

        public async Task HandleAsync(UserLoggedOutEvent domainEvent)
        {
            await LogAsync(domainEvent.UserId, "LOGOUT", "UserSession", domainEvent.UserId.ToString(), domainEvent);
        }

        public async Task HandleAsync(PasswordChangedEvent domainEvent)
        {
            await LogAsync(domainEvent.UserId, "PASSWORD_CHANGED", "AppUser", domainEvent.UserId.ToString(), domainEvent);
        }

        public async Task HandleAsync(UserLockedEvent domainEvent)
        {
            await LogAsync(domainEvent.AdminId, "ADMIN_LOCK", "AppUser", domainEvent.TargetUserId.ToString(), domainEvent);
        }

        public async Task HandleAsync(OrderPlacedEvent domainEvent)
        {
            await LogAsync(domainEvent.UserId, "ORDER_PLACED", "OrderRequest", domainEvent.OrderId.ToString(), domainEvent);
        }

        public async Task HandleAsync(SupportTicketCreatedEvent domainEvent)
        {
            await LogAsync(domainEvent.UserId, "TICKET_CREATED", "SupportTicket", domainEvent.TicketId.ToString(), domainEvent);
        }

        private async Task LogAsync(Guid userId, string action, string entityName, string entityId, object details)
        {
            var auditLog = new AuditLog
            {
                UserId = userId,
                Action = action,
                EntityName = entityName,
                EntityId = entityId,
                Details = JsonSerializer.Serialize(details)
            };

            await _unitOfWork.Repository<AuditLog>().AddAsync(auditLog);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}
