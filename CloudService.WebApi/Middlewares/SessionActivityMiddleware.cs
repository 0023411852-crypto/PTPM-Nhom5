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
            // Do not mark a session active until the downstream request completes.
            await _next(context);

            if (context.User.Identity?.IsAuthenticated != true)
            {
                return;
            }

            var userIdStr = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdStr, out var userId))
            {
                return;
            }

            var repo = unitOfWork.Repository<UserSession>();
            var sessions = await repo.ToListAsync(query => query
                .Where(s => s.UserId == userId && !s.IsRevoked)
                .OrderByDescending(s => s.LastActiveTimestamp)
                .Take(1));
            var session = sessions.FirstOrDefault();
            if (session == null)
            {
                return;
            }

            var now = DateTime.UtcNow;
            if ((now - session.LastActiveTimestamp).TotalMinutes > 1)
            {
                try
                {
                    session.LastActiveTimestamp = now;
                    repo.Update(session);
                    await unitOfWork.SaveChangesAsync();
                }
                catch (Exception)
                {
                    // Ignore session update failures
                }
            }
        }
    }
}
