using CloudService.Application.Interfaces;
using CloudService.Application.Mappings;
using CloudService.Application.Services;
using CloudService.Application.EventHandlers;
using CloudService.Domain.Events;
using Microsoft.Extensions.DependencyInjection;

namespace CloudService.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddAutoMapper(cfg => cfg.AddProfile<MappingProfile>());
            
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IServiceCategoryService, ServiceCategoryService>();
            services.AddScoped<IServicePlanService, ServicePlanService>();
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<IQRCodeService, QRCodeService>();
            services.AddScoped<INewsArticleService, NewsArticleService>();
            services.AddScoped<IAffiliateApplicationService, AffiliateApplicationService>();
            services.AddScoped<IUserService, UserService>();
            
            // Event Dispatcher & Handlers
            services.AddScoped<IEventDispatcher, EventDispatcher>();
            services.AddScoped<IEventHandler<UserRegisteredEvent>, AuditLogEventHandler>();
            services.AddScoped<IEventHandler<UserLoggedInEvent>, AuditLogEventHandler>();
            services.AddScoped<IEventHandler<UserLoggedOutEvent>, AuditLogEventHandler>();
            services.AddScoped<IEventHandler<PasswordChangedEvent>, AuditLogEventHandler>();
            services.AddScoped<IEventHandler<UserLockedEvent>, AuditLogEventHandler>();
            
            services.AddScoped<IEventHandler<PasswordChangedEvent>, SessionRevocationEventHandler>();
            services.AddScoped<IEventHandler<UserLockedEvent>, SessionRevocationEventHandler>();
            
            return services;
        }
    }
}
