namespace CloudService.Domain.Events
{
    public class PasswordChangedEvent : IDomainEvent
    {
        public Guid UserId { get; set; }
        public string IPAddress { get; set; } = string.Empty;
    }
}
