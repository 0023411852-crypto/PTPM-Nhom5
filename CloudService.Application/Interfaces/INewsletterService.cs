using CloudService.Application.DTOs.Newsletter;

namespace CloudService.Application.Interfaces
{
    public interface INewsletterService
    {
        Task SubscribeAsync(SubscribeNewsletterDto dto);
    }
}
