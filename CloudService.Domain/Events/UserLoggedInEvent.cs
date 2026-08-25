namespace CloudService.Domain.Events
{
    public class UserLoggedInEvent : IDomainEvent
    {
        public Guid UserId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string IPAddress { get; set; } = string.Empty;
    }
}
