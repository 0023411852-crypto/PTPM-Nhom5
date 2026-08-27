namespace CloudService.Application.DTOs.ServicePlans
{
    public class PlanPriceDto
    {
        public Guid Id { get; set; }
        public int BillingCycle { get; set; } // in months (1 = monthly only)
        public decimal Price { get; set; }
        public decimal? SetupFee { get; set; }
        public bool IsActive { get; set; }
    }
}
