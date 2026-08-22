namespace CloudService.Application.DTOs.ServicePlans
{
    public class PlanPriceDto
    {
        public Guid Id { get; set; }
        public string BillingCycle { get; set; } = string.Empty; // Monthly, Yearly
        public decimal Price { get; set; }
        public decimal? SetupFee { get; set; }
        public bool IsActive { get; set; }
    }
}
