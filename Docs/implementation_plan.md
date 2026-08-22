# Kế hoạch Triển khai Dự án: Hệ thống Bán Dịch vụ Cloud

Tài liệu này trình bày kế hoạch chi tiết, phân chia theo từng giai đoạn (Phase) để xây dựng hệ thống Bán Dịch vụ Cloud (Website và Web API). Kế hoạch được thiết kế theo quy trình phát triển phần mềm chuẩn mực, đảm bảo chất lượng, tiến độ và đáp ứng đầy đủ các tiêu chí chấm điểm khắt khe của Đồ án cuối kỳ.

> [!NOTE] 
> Hiện tại thư mục dự án đã được khởi tạo theo cấu trúc Clean Architecture: `Domain`, `Application`, `Infrastructure`, `WebApi`.

## User Review Required
> [!IMPORTANT]
> - **Lựa chọn Frontend:** Trong đề bài có 2 lựa chọn (Option A: Next.js, Option B: Blazor). Bạn muốn sử dụng công nghệ nào để tôi lên kế hoạch chi tiết hơn ở phần Frontend? *(Mặc định tôi sẽ đề xuất Next.js vì phổ biến hơn).*
> - **ORM:** Đề bài khuyến khích hybrid (EF Core + Dapper). Bạn muốn dùng 1 loại hay kết hợp cả 2?
> - **Thời gian:** Bạn có tổng cộng bao nhiêu tuần/ngày cho đến "Buổi 12" (hạn chót) để tôi có thể điều chỉnh timeline chính xác hơn?

---

## Lộ trình Phát triển (Phân chia Giai đoạn)

Dự án sẽ được chia thành 5 Giai đoạn chính (Sprints). Giả định tổng thời gian là 4 tuần (1 Sprint = ~5-7 ngày làm việc).

### Giai đoạn 1: Khởi tạo, Thiết kế CSDL & Core Domain (Tuần 1)
**Mục tiêu:** Xây dựng móng vững chắc cho hệ thống, hoàn thiện thiết kế Database và tầng Domain.

1. **Setup Môi trường & Quy trình (DevOps cơ bản):**
   - Khởi tạo Git repository trên GitHub.
   - Thống nhất Git Workflow (Feature branching, Pull Request).
   - Thiết lập cấu trúc thư mục Frontend (Next.js/Blazor).
2. **Thiết kế Hệ thống:**
   - Vẽ Sơ đồ Thực thể Liên kết (ERD) hoàn chỉnh. Các Entities dự kiến: `ServiceCategory`, `ServicePlan`, `PlanPrice`, `Promotion`, `NewsArticle`, `OrderRequest`, `AffiliateApplication`, `AppUser`, `Role`, `AuditLog`.
3. **Phát triển Tầng Domain (Core):**
   - Định nghĩa các Entities, Value Objects, Enums.
   - Định nghĩa các Interfaces cho Repository (Design Pattern: **Repository**).
4. **Phát triển Tầng Infrastructure (Database):**
   - Cài đặt Entity Framework Core.
   - Cấu hình Fluent API / Data Annotations.
   - Tạo Migration và cập nhật Database (SQL Server).
   - Implement các Repositories và **Unit of Work** pattern.

### Giai đoạn 2: Phát triển Core API & Authentication (Tuần 2)
**Mục tiêu:** Xây dựng nền tảng API, xử lý nghiệp vụ chính và bảo mật hệ thống.

1. **Authentication & Authorization:**
   - Setup JWT Authentication + Refresh Token.
   - Implement Role-based Authorization (Admin, Editor).
   - Implement Password Hashing (Bcrypt).
2. **Tầng Application (Use Cases & Business Logic):**
   - Xây dựng DTOs (Data Transfer Objects).
   - Xây dựng các Services/Handlers (có thể dùng CQRS với MediatR hoặc Service truyền thống).
   - Áp dụng các Design Patterns khác: **Factory** (khởi tạo Order/Plan), **Observer** (Logging, Audit Log).
3. **Phát triển Web API (Endpoints cơ bản):**
   - API Đăng nhập/Đăng ký, Đổi mật khẩu.
   - API Quản lý Gói dịch vụ, Bảng giá, Khuyến mãi (Admin).
   - Áp dụng chuẩn RESTful, ProblemDetails, Pagination/Filtering.
4. **Unit Testing (Phase 1):**
   - Viết xUnit + Moq cho các Services quan trọng ở tầng Application/Domain (nhắm tới >= 15 test cases).

### Giai đoạn 3: Hoàn thiện API & Bắt đầu Frontend (Tuần 3)
**Mục tiêu:** Hoàn thành toàn bộ Backend API và xây dựng bộ khung Frontend.

1. **Backend - Các tính năng nâng cao:**
   - API tạo mã QR cho gói dịch vụ.
   - API xuất Excel (dùng EPPlus/ClosedXML).
   - API Thống kê (dữ liệu cho biểu đồ).
   - Cấu hình Swagger/OpenAPI.
2. **Frontend - Setup & Layout:**
   - Khởi tạo base source code, setup UI Library (TailwindCSS, AntD/MUI...).
   - Xây dựng Layout chung: Header, Footer, Sidebar (cho Admin).
   - Setup API Client (Axios/Fetch) + Interceptors (đính kèm JWT).
3. **Frontend - Landing Page (Giao diện người dùng):**
   - Trang chủ (Hero banner, Gói nổi bật...).
   - Trang Giới thiệu, Bảng giá, Danh mục dịch vụ.

### Giai đoạn 4: Tích hợp Frontend & Trang Quản trị Admin (Tuần 4)
**Mục tiêu:** Ghép nối hoàn thiện Frontend với Backend, tập trung vào Dashboard.

1. **Trang Quản trị Admin (Yêu cầu đăng nhập):**
   - Chức năng Đăng nhập.
   - Bảng điều khiển (Dashboard) với biểu đồ thống kê.
   - Màn hình CRUD (Gói dịch vụ, Bài viết, Đơn hàng...).
   - Xem/xuất Audit log và xuất Excel danh sách đơn hàng.
2. **Hoàn thiện Landing Page:**
   - Chức năng Đăng ký dịch vụ, Đăng ký Affiliate.
   - Tích hợp quét mã QR (hiển thị trang chi tiết).
3. **Kiểm thử tích hợp (End-to-End):**
   - Đội nhóm thực hiện test luồng từ User (Landing) đến Admin (Dashboard).

### Giai đoạn 5: DevOps, Triển khai & Đóng gói (Tuần 4 - Cuối tuần)
**Mục tiêu:** Chuẩn bị sản phẩm sẵn sàng demo và báo cáo.

1. **Docker & CI/CD:**
   - Viết `Dockerfile` cho Backend API và Frontend.
   - Viết `docker-compose.yml` để chạy cục bộ (API + DB + Web).
   - Thiết lập GitHub Actions tự động Build & Test khi có PR.
2. **Triển khai (Deployment):**
   - Deploy lên VPS hoặc Cloud (Azure/AWS/Render).
   - Thiết lập Serilog (ghi log ra file/console).
3. **Hoàn thiện Báo cáo & Tài liệu:**
   - Viết README.md đầy đủ (hướng dẫn `docker-compose up`).
   - Cập nhật báo cáo PDF (ERD, Kiến trúc, Code Snippet của Design Patterns).
   - Luyện tập Demo trôi chảy.

---

## Đề xuất các bước tiếp theo (Next Steps)

Ngay bây giờ, với vai trò Tech Lead, tôi đề xuất chúng ta bắt tay vào **Giai đoạn 1** với các công việc cụ thể sau:

1. **Chốt công nghệ Frontend:** Vui lòng xác nhận bạn dùng Next.js hay Blazor.
2. **Thiết kế Database (ERD):** Tôi sẽ tạo các Entity classes trong `CloudService.Domain` dựa trên yêu cầu đề bài, thiết lập quan hệ (1-n, n-n) và cấu hình DbContext tại `CloudService.Infrastructure`.
3. **Setup Git & CI/CD cơ bản:** Đảm bảo mọi commit sau này đều chuẩn chỉnh.

**Bạn đã sẵn sàng để tôi viết code khởi tạo tầng Domain (Entities & Interfaces) chưa?** Vui lòng trả lời các câu hỏi ở phần *User Review Required* để chúng ta bắt đầu!
