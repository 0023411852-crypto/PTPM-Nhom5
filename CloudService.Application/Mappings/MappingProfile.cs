using AutoMapper;
using CloudService.Application.DTOs.AffiliateApplications;
using CloudService.Application.DTOs.NewsArticles;
using CloudService.Application.DTOs.Orders;
using CloudService.Application.DTOs.ServiceCategories;
using CloudService.Application.DTOs.ServicePlans;
using CloudService.Application.DTOs.Users;
using CloudService.Domain.Entities;

namespace CloudService.Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<ServiceCategory, ServiceCategoryDto>();
            CreateMap<CreateServiceCategoryDto, ServiceCategory>()
                .ForMember(dest => dest.Slug, opt => opt.MapFrom(src => GenerateSlug(src.Name)));
            CreateMap<UpdateServiceCategoryDto, ServiceCategory>()
                .ForMember(dest => dest.Slug, opt => opt.MapFrom(src => GenerateSlug(src.Name)));

            CreateMap<ServicePlan, ServicePlanDto>();
            CreateMap<PlanPrice, PlanPriceDto>();
            CreateMap<CreateServicePlanDto, ServicePlan>();
            CreateMap<UpdateServicePlanDto, ServicePlan>()
                .ForMember(dest => dest.Prices, opt => opt.Ignore());
            CreateMap<CreatePlanPriceDto, PlanPrice>();

            CreateMap<OrderRequest, OrderDto>();
            CreateMap<CreateOrderDto, OrderRequest>();

            CreateMap<NewsArticle, NewsArticleDto>()
                .ForMember(dest => dest.AuthorName, opt => opt.MapFrom(src => src.Author != null ? src.Author.FullName : string.Empty));
            CreateMap<CreateNewsArticleDto, NewsArticle>();
            CreateMap<UpdateNewsArticleDto, NewsArticle>();

            CreateMap<AffiliateApplication, AffiliateApplicationDto>();
            CreateMap<CreateAffiliateApplicationDto, AffiliateApplication>();
            CreateMap<UpdateAffiliateApplicationDto, AffiliateApplication>();

            CreateMap<AppUser, UserDto>();
            
            CreateMap<CustomerService, CloudService.Application.DTOs.CustomerServices.CustomerServiceDto>();
            CreateMap<SupportTicket, CloudService.Application.DTOs.SupportTickets.SupportTicketDto>();
            CreateMap<TicketReply, CloudService.Application.DTOs.SupportTickets.TicketReplyDto>();
            CreateMap<SiteSetting, CloudService.Application.DTOs.SiteSettingDto>();
            
            CreateMap<StaticPage, CloudService.Application.DTOs.StaticPages.StaticPageDto>()
                .ForMember(dest => dest.AuthorName, opt => opt.MapFrom(src => src.Author != null ? src.Author.FullName : string.Empty));
            CreateMap<CloudService.Application.DTOs.StaticPages.CreateStaticPageDto, StaticPage>();
            CreateMap<CloudService.Application.DTOs.StaticPages.UpdateStaticPageDto, StaticPage>();

            CreateMap<Promotion, CloudService.Application.DTOs.Promotions.PromotionDto>()
                .ForMember(dest => dest.ServicePlanIds, opt => opt.MapFrom(src => src.ServicePlans.Select(sp => sp.Id).ToList()));
            CreateMap<CloudService.Application.DTOs.Promotions.CreatePromotionDto, Promotion>()
                .ForMember(dest => dest.ServicePlans, opt => opt.Ignore());
            CreateMap<CloudService.Application.DTOs.Promotions.UpdatePromotionDto, Promotion>()
                .ForMember(dest => dest.ServicePlans, opt => opt.Ignore());

            CreateMap<MediaFile, CloudService.Application.DTOs.Media.MediaFileDto>().ReverseMap();
        }

        private string GenerateSlug(string phrase)
        {
            string str = phrase.ToLowerInvariant();
            str = System.Text.RegularExpressions.Regex.Replace(str, @"[^a-z0-9\s-]", "");
            str = System.Text.RegularExpressions.Regex.Replace(str, @"\s+", " ").Trim();
            str = str.Substring(0, str.Length <= 45 ? str.Length : 45).Trim();
            str = System.Text.RegularExpressions.Regex.Replace(str, @"\s", "-");
            return str;
        }
    }
}
