using CloudService.Application.Interfaces;
using QRCoder;

namespace CloudService.Application.Services
{
    public class QRCodeService : IQRCodeService
    {
        public string GenerateQRCodeBase64(string text)
        {
            using var qrGenerator = new QRCodeGenerator();
            using var qrCodeData = qrGenerator.CreateQrCode(text, QRCodeGenerator.ECCLevel.Q);
            using var qrCode = new Base64QRCode(qrCodeData);
            return qrCode.GetGraphic(20);
        }
    }
}
