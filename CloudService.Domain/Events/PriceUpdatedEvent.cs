namespace CloudService.Domain.Events
{
    public class PriceUpdatedEvent : IDomainEvent
    {
        public Guid UserId { get; set; }
        public Guid PlanPriceId { get; set; }
        public Guid ServicePlanId { get; set; }
        public decimal OldPrice { get; set; }
        public decimal NewPrice { get; set; }
        public int BillingCycle { get; set; }
    }
}
