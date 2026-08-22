using CloudService.Application.DTOs.Newsletter;
using CloudService.Application.Interfaces;
using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;

namespace CloudService.Application.Services
{
    public class NewsletterService : INewsletterService
    {
        private readonly IUnitOfWork _unitOfWork;

        public NewsletterService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task SubscribeAsync(SubscribeNewsletterDto dto)
        {
            var email = dto.Email.Trim().ToLowerInvariant();
            var repository = _unitOfWork.Repository<NewsletterSubscriber>();
            var existing = (await repository.GetAllAsync()).FirstOrDefault(x => x.Email == email);

            if (existing != null)
            {
                if (!existing.IsActive)
                {
                    existing.IsActive = true;
                    repository.Update(existing);
                    await _unitOfWork.SaveChangesAsync();
                }
                return;
            }

            await repository.AddAsync(new NewsletterSubscriber
            {
                Email = email,
                IsActive = true
            });
            await _unitOfWork.SaveChangesAsync();
        }
    }
}
