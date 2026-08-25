using System;

namespace CloudService.Domain.Events
{
    public class OrderPlacedEvent : IDomainEvent
    {
        public Guid UserId { get; set; }
        public Guid OrderId { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime Timestamp { get; set; }

        public OrderPlacedEvent(Guid userId, Guid orderId, decimal totalAmount)
        {
            UserId = userId;
            OrderId = orderId;
            TotalAmount = totalAmount;
            Timestamp = DateTime.UtcNow;
        }
    }
}
