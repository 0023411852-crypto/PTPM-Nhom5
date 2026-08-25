using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using CloudService.Application.Interfaces;
using CloudService.Application.Common;
using Microsoft.AspNetCore.Authorization;

namespace CloudService.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
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
        [Authorize(Roles = "Admin,Editor")]
        public async Task<IActionResult> GetMediaFiles([FromQuery] PaginationFilter filter, [FromQuery] string? fileType, [FromQuery] string? search)
        {
            var result = await _mediaService.GetMediaFilesAsync(filter, fileType, search);
            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Editor")]
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

            // Validate MIME type by reading file header
            using (var stream = file.OpenReadStream())
            {
                var buffer = new byte[12];
                await stream.ReadAsync(buffer, 0, 12);
                
                // Check for common file signatures
                bool isValidMime = false;
                
                if (fileType == "Hình ảnh")
                {
                    // JPEG: FF D8 FF
                    if (buffer[0] == 0xFF && buffer[1] == 0xD8 && buffer[2] == 0xFF) isValidMime = true;
                    // PNG: 89 50 4E 47
                    else if (buffer[0] == 0x89 && buffer[1] == 0x50 && buffer[2] == 0x4E && buffer[3] == 0x47) isValidMime = true;
                    // GIF: 47 49 46 38
                    else if (buffer[0] == 0x47 && buffer[1] == 0x49 && buffer[2] == 0x46 && buffer[3] == 0x38) isValidMime = true;
                    // WebP: 52 49 46 46 ... 57 45 42 50
                    else if (buffer[0] == 0x52 && buffer[1] == 0x49 && buffer[2] == 0x46 && buffer[3] == 0x46 && 
                             buffer[8] == 0x57 && buffer[9] == 0x45 && buffer[10] == 0x42 && buffer[11] == 0x50) isValidMime = true;
                }
                else if (fileType == "Video")
                {
                    // MP4: starts with ftyp (66 74 79 70)
                    if (buffer[4] == 0x66 && buffer[5] == 0x74 && buffer[6] == 0x79 && buffer[7] == 0x70) isValidMime = true;
                }
                else if (fileType == "Tài liệu")
                {
                    // PDF: 25 50 44 46
                    if (buffer[0] == 0x25 && buffer[1] == 0x50 && buffer[2] == 0x44 && buffer[3] == 0x46) isValidMime = true;
                    // DOCX/XLSX: 50 4B 03 04 (ZIP signature)
                    else if (buffer[0] == 0x50 && buffer[1] == 0x4B && buffer[2] == 0x03 && buffer[3] == 0x04) isValidMime = true;
                }
                
                if (!isValidMime)
                    return BadRequest(new { message = "File không hợp lệ. Nội dung file không khớp với định dạng." });
            }

            // Sanitize filename - only use extension, not original filename
            var sanitizedExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
            var uniqueFileName = Guid.NewGuid().ToString() + sanitizedExtension;
            
            var uploadsFolder = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads");
            
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

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
        [Authorize(Roles = "Admin,Editor")]
        public async Task<IActionResult> DeleteMedia(Guid id)
        {
            var result = await _mediaService.DeleteMediaFileAsync(id);
            if (!result)
                return NotFound(new { message = "Không tìm thấy file" });

            return Ok(new { message = "Xóa file thành công" });
        }
    }
}
