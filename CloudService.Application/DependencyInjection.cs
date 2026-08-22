using CloudService.Application.Interfaces;
using CloudService.Application.Mappings;
using CloudService.Application.Services;
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
            
            return services;
        }
    }
}
