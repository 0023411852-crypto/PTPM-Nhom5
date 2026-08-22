using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using CloudService.Application.Interfaces;
using CloudService.Application.Common;

namespace CloudService.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        private readonly IMediaService _mediaService;

        public UploadController(IWebHostEnvironment env, IMediaService mediaService)
        {
            _env = env;
            _mediaService = mediaService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMediaFiles([FromQuery] PaginationFilter filter, [FromQuery] string? fileType, [FromQuery] string? search)
        {
            var result = await _mediaService.GetMediaFilesAsync(filter, fileType, search);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "Không tìm thấy file" });

            // Giới hạn 5MB
            if (file.Length > 5 * 1024 * 1024)
                return BadRequest(new { message = "File quá lớn. Vui lòng chọn file dưới 5MB." });

            var allowedImageExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            var allowedVideoExtensions = new[] { ".mp4", ".mov", ".avi", ".mkv" };
            var allowedDocExtensions = new[] { ".pdf", ".doc", ".docx", ".xls", ".xlsx" };
            
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            
            string fileType = "Tài liệu";
            if (allowedImageExtensions.Contains(extension)) fileType = "Hình ảnh";
            else if (allowedVideoExtensions.Contains(extension)) fileType = "Video";
            
            if (fileType == "Tài liệu" && !allowedDocExtensions.Contains(extension))
                return BadRequest(new { message = "Định dạng file không được hỗ trợ." });

            var uploadsFolder = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads");
            
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var fileUrl = $"/uploads/{uniqueFileName}";
            var fileSize = (file.Length / 1024).ToString() + " KB";
            if (file.Length > 1024 * 1024)
            {
                fileSize = (file.Length / 1024.0 / 1024.0).ToString("0.##") + " MB";
            }

            var mediaFile = await _mediaService.AddMediaFileAsync(file.FileName, fileUrl, fileSize, fileType);

            return Ok(new { url = fileUrl, media = mediaFile });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedia(Guid id)
        {
            var result = await _mediaService.DeleteMediaFileAsync(id);
            if (!result)
                return NotFound(new { message = "Không tìm thấy file" });

            return Ok(new { message = "Xóa file thành công" });
        }
    }
}
