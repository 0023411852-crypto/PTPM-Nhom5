# Cập nhật README và Docker Compose

**Nhánh:** `Linh-dev-1`

**Ngày:** 22/08/2026

## Phạm vi

Batch này xử lý khả năng chạy dự án bằng Docker Compose và bổ sung hướng dẫn cho thành viên/người chấm. Không thay đổi nghiệp vụ frontend, API đơn hàng hoặc schema nghiệp vụ.

## Thay đổi

`README.md` đã được viết lại với kiến trúc các project, yêu cầu môi trường, lệnh chạy Docker/local, URL frontend/API/Swagger/SQL Server, migration/seed, kịch bản Demo Payment, tài khoản và các cảnh báo bảo mật.

`docker-compose.yml` đã được chuẩn hóa để dùng biến môi trường cho mật khẩu SQL Server/JWT secret, thêm healthcheck SQL Server và chỉ khởi động API sau khi database healthy. API container bật `Database:AutoMigrate=true` trong Compose Development để tự apply migration khi database demo sẵn sàng. `CloudService.WebApi/Program.cs` chỉ chạy auto-migration khi cờ cấu hình này được bật rõ ràng.

## Kiểm tra

`git diff --check` pass. Sau khi xóa cache `.next` cũ do route Admin đã được di chuyển, `npx tsc --noEmit` pass. `npm run build` pass.

Sandbox hiện không có Docker daemon và .NET SDK, nên chưa thể xác minh thực tế `docker compose up --build`, `dotnet build` hoặc `dotnet test`. Cần chạy các lệnh này trên máy có Docker Desktop và .NET SDK 8 để hoàn tất kiểm chứng.

## Lưu ý

Compose hiện bật `DemoPayment` và auto-migration cho mục đích demo học tập. Không dùng các giá trị mặc định trong production; cần dùng secret manager, CORS allowlist, HTTPS và payment gateway có callback/webhook xác thực.
