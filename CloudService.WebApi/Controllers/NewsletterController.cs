using CloudService.Application.DTOs.Newsletter;
using CloudService.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CloudService.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NewsletterController : ControllerBase
    {
        private readonly INewsletterService _newsletterService;

        public NewsletterController(INewsletterService newsletterService)
        {
            _newsletterService = newsletterService;
        }

        [HttpPost("subscribe")]
        public async Task<IActionResult> Subscribe([FromBody] SubscribeNewsletterDto dto)
        {
            if (!ModelState.IsValid)
                return ValidationProblem(ModelState);

            await _newsletterService.SubscribeAsync(dto);
            return Ok(new { message = "Đăng ký nhận email thành công." });
        }
    }
}
