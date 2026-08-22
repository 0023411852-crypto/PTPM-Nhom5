namespace CloudService.Domain.Events
{
    public class UserLockedEvent : IDomainEvent
    {
        public Guid TargetUserId { get; set; }
        public Guid AdminId { get; set; }
        public string IPAddress { get; set; } = string.Empty;
    }
}
