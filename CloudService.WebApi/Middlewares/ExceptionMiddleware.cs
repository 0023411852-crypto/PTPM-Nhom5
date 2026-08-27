using CloudService.Domain.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Text.Json;

namespace CloudService.WebApi.Middlewares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An exception occurred: {Message}", ex.Message);
                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            if (context.Response.HasStarted)
            {
                return;
            }
            
            context.Response.ContentType = "application/json";

            int statusCode = exception switch
            {
                ValidationException => (int)HttpStatusCode.BadRequest,
                UnauthorizedException => (int)HttpStatusCode.Unauthorized,
                NotFoundException => (int)HttpStatusCode.NotFound,
                ConflictException => (int)HttpStatusCode.Conflict,
                Microsoft.EntityFrameworkCore.DbUpdateException => (int)HttpStatusCode.BadRequest,
                _ => (int)HttpStatusCode.InternalServerError
            };

            context.Response.StatusCode = statusCode;

            string detailMessage = exception.Message;
            if (statusCode == (int)HttpStatusCode.InternalServerError)
            {
                detailMessage = "Đã xảy ra lỗi hệ thống nghiêm trọng. Vui lòng thử lại sau.";
            }
            else if (exception is Microsoft.EntityFrameworkCore.DbUpdateException)
            {
                detailMessage = "Lỗi khi cập nhật cơ sở dữ liệu. Vui lòng kiểm tra lại thông tin đầu vào (ví dụ: trùng lặp dữ liệu, thiếu trường bắt buộc).";
            }
            
            if (detailMessage.Contains("An error occurred while saving the entity changes. See the inner exception for details."))
            {
                detailMessage = "Đã xảy ra lỗi khi lưu thay đổi. Vui lòng xem chi tiết lỗi bên trong.";
            }

            var problemDetails = new ProblemDetails
            {
                Status = statusCode,
                Title = GetTitle(statusCode),
                Detail = detailMessage,
                Instance = context.Request.Path
            };

            var json = JsonSerializer.Serialize(problemDetails);
            await context.Response.WriteAsync(json);
        }

        private static string GetTitle(int statusCode)
        {
            return statusCode switch
            {
                400 => "Yêu cầu không hợp lệ",
                401 => "Chưa xác thực",
                403 => "Không có quyền truy cập",
                404 => "Không tìm thấy dữ liệu",
                409 => "Xung đột dữ liệu",
                _ => "Lỗi hệ thống"
            };
        }
    }
}
