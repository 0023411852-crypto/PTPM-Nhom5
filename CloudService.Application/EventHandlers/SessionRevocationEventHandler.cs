using CloudService.Domain.Entities;
using CloudService.Domain.Events;
using CloudService.Domain.Interfaces;

namespace CloudService.Application.EventHandlers
{
    public class SessionRevocationEventHandler : 
        IEventHandler<PasswordChangedEvent>,
        IEventHandler<UserLockedEvent>
    {
        private readonly IUnitOfWork _unitOfWork;

        public SessionRevocationEventHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task HandleAsync(PasswordChangedEvent domainEvent)
        {
            await RevokeSessionsAsync(domainEvent.UserId, "PASSWORD_CHANGED");
        }

        public async Task HandleAsync(UserLockedEvent domainEvent)
        {
            await RevokeSessionsAsync(domainEvent.TargetUserId, "ADMIN_LOCK");
        }

        private async Task RevokeSessionsAsync(Guid userId, string reason)
        {
            var repo = _unitOfWork.Repository<UserSession>();
            var allSessions = await repo.GetAllAsync();
            var activeSessions = allSessions.Where(s => s.UserId == userId && !s.IsRevoked).ToList();
            
            foreach(var session in activeSessions)
            {
                session.IsRevoked = true;
                session.RevokedAt = DateTime.UtcNow;
                session.RevokedReason = reason;
                repo.Update(session);
            }
            await _unitOfWork.SaveChangesAsync();
        }
    }
}
