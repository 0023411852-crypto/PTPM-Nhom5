# CloudNova – Website bán dịch vụ Cloud

CloudNova là đồ án website bán dịch vụ Cloud gồm VPS, Hosting, Domain, Email doanh nghiệp, SSL và Firewall chống DDoS. Hệ thống cung cấp trang giới thiệu công khai, bảng giá, tin tức/blog, đăng ký dịch vụ, checkout demo, lịch sử đơn hàng, dịch vụ khách hàng, đánh giá và khu vực quản trị.

> **Lưu ý về thanh toán:** repository hiện dùng `Demo Payment` cho mục đích trình diễn môn học. Nút `Tôi đã thanh toán (DEMO)` không giao dịch tiền thật. Khi triển khai thực tế cần thay bằng cổng thanh toán có callback/webhook xác thực.

## Kiến trúc

| Thành phần | Công nghệ | Thư mục |
|---|---|---|
| Domain | .NET 8 Class Library, entities, enums, domain contracts | `CloudService.Domain` |
| Application | .NET 8, DTO, validators, services, Repository/Unit of Work contracts | `CloudService.Application` |
| Infrastructure | .NET 8, EF Core 8, SQL Server provider, migrations, repositories | `CloudService.Infrastructure` |
| Web API | ASP.NET Core Web API .NET 8, JWT, Swagger/OpenAPI | `CloudService.WebApi` |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS | `cloud-service-frontend` |
| Database | SQL Server, EF Core migrations và script SQL | `database_script.sql`, `seed_data.sql` |

## Yêu cầu môi trường

Có thể chạy bằng Docker Desktop hoặc cài thủ công .NET SDK 8.x, Node.js 18+ và SQL Server. Khi chạy thủ công, API dùng connection string `ConnectionStrings:DefaultConnection`; nên ghi đè bằng User Secrets hoặc biến môi trường thay vì sửa secret trong source code.

## Chạy bằng Docker Compose

Từ thư mục gốc repository:

```bash
docker compose up --build
```

Compose khởi động SQL Server, chờ database healthy, sau đó chạy API với EF Core auto-migration trong môi trường Development và chạy frontend. Các địa chỉ mặc định là:

| Dịch vụ | URL |
|---|---|
| Frontend | <http://localhost:3000> |
| API | <http://localhost:5154> |
| Swagger | <http://localhost:5154/swagger> |
| SQL Server | `localhost:1433` |

Có thể đổi mật khẩu SQL Server hoặc JWT secret cho local bằng file `.env` cạnh `docker-compose.yml`; không commit file này:

```dotenv
MSSQL_SA_PASSWORD=YourStrong!Passw0rd
JWT_SECRET=replace-with-a-long-local-secret
```

Nếu cần làm sạch database Docker và tạo lại từ đầu:

```bash
docker compose down -v
docker compose up --build
```

## Chạy thủ công

```bash
dotnet restore CloudServiceSolution.sln
dotnet run --project CloudService.WebApi/CloudService.WebApi.csproj --urls http://localhost:5154
```

Ở terminal khác:

```bash
cd cloud-service-frontend
npm ci
npm run dev
```

Frontend chạy tại <http://localhost:3000>. Nếu API chạy ở host/port khác, cần cập nhật base URL API trong frontend hoặc cấu hình reverse proxy trước khi deploy.

## Database và dữ liệu mẫu

Migrations nằm trong `CloudService.Infrastructure/Migrations`. Khi chạy Docker Compose, `Database:AutoMigrate=true` được bật riêng cho container API Development. Khi chạy ngoài Docker:

```bash
dotnet ef database update \
  --project CloudService.Infrastructure \
  --startup-project CloudService.WebApi
```

`database_script.sql` tạo schema thủ công; `seed_data.sql` chứa dữ liệu mẫu cho role, danh mục VPS/Hosting, gói và giá. Script seed chưa tạo sẵn tài khoản đăng nhập; hãy đăng ký Customer trên giao diện hoặc chuẩn bị tài khoản quản trị riêng cho database demo.

## Kịch bản demo

Mở trang chủ, dịch vụ, bảng giá và tin tức. Đăng ký/đăng nhập Customer, chọn gói, kiểm tra checkout rồi bấm `Tôi đã thanh toán (DEMO)`. Hệ thống hoàn tất đơn mô phỏng, tạo dịch vụ VPS demo và hiển thị thông tin tại Client Portal. Tại đây có thể xem lịch sử/chi tiết đơn, thông tin VPS demo, tạo ticket và gửi đánh giá.

Đối với Admin, trình diễn CRUD danh mục, gói dịch vụ, giá, khuyến mãi, bài viết, trang tĩnh, media, cài đặt, partner request, support ticket, báo cáo và xuất danh sách đơn. Theo thiết kế nghiệp vụ hiện tại, Admin không tự tạo đơn và không tự đổi trạng thái đơn; đơn demo được hoàn tất bởi endpoint Demo Payment của khách hàng.

## Tài khoản và bảo mật

Repository không commit mật khẩu tài khoản demo cố định. Khi trình diễn, nên tạo Customer mới và chuẩn bị Admin/Editor riêng trong database demo. Không dùng secret mặc định cho production. `DemoPayment.Enabled` chỉ nên bật trong môi trường demo.

## Kiểm tra mã nguồn

```bash
cd cloud-service-frontend
npx tsc --noEmit
npm run build
npm run lint
```

```bash
dotnet build CloudServiceSolution.sln
dotnet test CloudServiceSolution.sln --collect:"XPlat Code Coverage"
```

## Tài liệu dự án

Tài liệu audit, ERD và nhật ký triển khai nằm trong `Docs/`, gồm `erd.md`, `implementation_plan.md`, các báo cáo kiểm tra chức năng và `FINAL_REQUIREMENTS_AUDIT_20260822.md`.

## Trạng thái triển khai

Đây là phiên bản phục vụ đồ án cuối kỳ. Docker Compose, Demo Payment và cấu hình mặc định được thiết kế cho môi trường học tập/local. Trước khi đưa lên Internet cần bổ sung secret management, CORS allowlist, HTTPS, payment thật có webhook, logging, monitoring và kiểm tra backend runtime đầy đủ.
