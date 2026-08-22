using AutoMapper;
using CloudService.Application.DTOs.AffiliateApplications;
using CloudService.Application.DTOs.NewsArticles;
using CloudService.Application.DTOs.Orders;
using CloudService.Application.DTOs.ServiceCategories;
using CloudService.Application.DTOs.ServicePlans;
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
            CreateMap<CreateServicePlanDto, ServicePlan>();
            CreateMap<UpdateServicePlanDto, ServicePlan>();

            CreateMap<OrderRequest, OrderDto>();
            CreateMap<CreateOrderDto, OrderRequest>();

            CreateMap<NewsArticle, NewsArticleDto>();
            CreateMap<CreateNewsArticleDto, NewsArticle>();
            CreateMap<UpdateNewsArticleDto, NewsArticle>();

            CreateMap<AffiliateApplication, AffiliateApplicationDto>();
            CreateMap<CreateAffiliateApplicationDto, AffiliateApplication>();
            CreateMap<UpdateAffiliateApplicationDto, AffiliateApplication>();
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
