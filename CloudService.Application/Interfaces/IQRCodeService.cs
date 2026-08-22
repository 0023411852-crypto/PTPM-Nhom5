namespace CloudService.Application.Interfaces
{
    public interface IQRCodeService
    {
        string GenerateQRCodeBase64(string text);
    }
}
