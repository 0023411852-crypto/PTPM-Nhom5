namespace CloudService.Domain.Events
{
    public class UserRegisteredEvent : IDomainEvent
    {
        public Guid UserId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string IPAddress { get; set; } = string.Empty;
    }
}
