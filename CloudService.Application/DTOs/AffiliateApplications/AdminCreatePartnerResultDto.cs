namespace CloudService.Application.DTOs.AffiliateApplications
{
    public class AdminCreatePartnerResultDto
    {
        public AffiliateApplicationDto Application { get; set; } = new();

        // Returned only once to the authorized admin who creates a new partner account.
        // The password is never persisted in plaintext or exposed by normal application DTOs.
        public string? TemporaryPassword { get; set; }

        public bool RequiresPasswordSetup { get; set; }
    }
}
