using System.ComponentModel.DataAnnotations;

namespace CloudService.Application.DTOs.ServicePlans
{
    public class CreatePlanPriceDto
    {
        [Required]
        public string BillingCycle { get; set; } = "1";

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Price must be greater than or equal to 0")]
        public decimal Price { get; set; }

        public decimal? SetupFee { get; set; } = 0;
    }
}
