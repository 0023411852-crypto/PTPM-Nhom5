using CloudService.Domain.Events;

namespace CloudService.Application.Interfaces
{
    public interface IEventDispatcher
    {
        Task DispatchAsync<TEvent>(TEvent domainEvent) where TEvent : IDomainEvent;
    }
}
