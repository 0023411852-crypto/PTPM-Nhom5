namespace CloudService.Application.DTOs.Orders
{
    public class DemoPaymentResultDto
    {
        public Guid OrderId { get; set; }
        public string Status { get; set; } = string.Empty;
        public bool AlreadyProcessed { get; set; }
        public bool DemoMode { get; set; } = true;
        public string ServiceName { get; set; } = string.Empty;
        public string VpsIP { get; set; } = string.Empty;
        public string VpsUser { get; set; } = string.Empty;
        public string VpsPassword { get; set; } = string.Empty;
        public DateTime ExpiryDate { get; set; }
    }
}
