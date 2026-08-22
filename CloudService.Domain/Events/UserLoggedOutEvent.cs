namespace CloudService.Domain.Events
{
    public class UserLoggedOutEvent : IDomainEvent
    {
        public Guid UserId { get; set; }
        public string IPAddress { get; set; } = string.Empty;
    }
}
