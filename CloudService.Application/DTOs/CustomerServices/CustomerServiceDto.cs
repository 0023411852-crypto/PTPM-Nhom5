using System;

namespace CloudService.Application.DTOs.CustomerServices
{
    public class CustomerServiceDto
    {
        public Guid Id { get; set; }
        public Guid OrderId { get; set; }
        public Guid CustomerId { get; set; }
        public string ServiceName { get; set; } = string.Empty;
        public string VpsIP { get; set; } = string.Empty;
        public string VpsUser { get; set; } = string.Empty;
        public string VpsPassword { get; set; } = string.Empty;
        public DateTime ExpiryDate { get; set; }
        public string Status { get; set; } = "Active";
        public DateTime CreatedAt { get; set; }
    }
}
