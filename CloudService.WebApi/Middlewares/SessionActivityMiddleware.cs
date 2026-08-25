using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;
using System.Security.Claims;

namespace CloudService.WebApi.Middlewares
{
    public class SessionActivityMiddleware
    {
        private readonly RequestDelegate _next;

        public SessionActivityMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, IUnitOfWork unitOfWork)
        {
            if (context.User.Identity?.IsAuthenticated == true)
            {
                var userIdStr = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (Guid.TryParse(userIdStr, out var userId))
                {
                    var repo = unitOfWork.Repository<UserSession>();
                    var sessions = await repo.GetAllAsync();
                    var activeSessions = sessions.Where(s => s.UserId == userId && !s.IsRevoked).ToList();
                    
                    var now = DateTime.UtcNow;
                    bool updated = false;

                    foreach(var session in activeSessions)
                    {
                        if ((now - session.LastActiveTimestamp).TotalMinutes > 1)
                        {
                            session.LastActiveTimestamp = now;
                            repo.Update(session);
                            updated = true;
                        }
                    }

                    if (updated)
                    {
                        await unitOfWork.SaveChangesAsync();
                    }
                }
            }

            await _next(context);
        }
    }
}
