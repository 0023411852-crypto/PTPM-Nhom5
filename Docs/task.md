# Giai đoạn 2: Phát triển Core API & Authentication

- [x] **1. Authentication & Authorization**
  - [x] Thiết lập JWT Authentication trong WebApi.
  - [x] Cấu hình Swagger để hỗ trợ truyền JWT (Bearer token).
  - [x] Implement Password Hashing bằng BCrypt.
  - [x] Xây dựng tính năng Đăng ký, Đăng nhập (Tạo JWT) và Phân quyền (Role-based).
- [x] **2. Tầng Application (Business Logic & Mapping)**
  - [x] Cài đặt `AutoMapper` và cấu hình DTOs.
  - [x] Triển khai các Services (IAuthService, IServiceCategoryService, IServicePlanService).
- [x] **2. Tầng Application (Business Logic & Mapping)**
  - [x] Cài đặt `AutoMapper` và cấu hình DTOs.
  - [x] Triển khai các Services (IAuthService, IServiceCategoryService, IServicePlanService).
  - [x] Triển khai phụ trợ: INewsArticleService, IAffiliateApplicationService.
- [x] **3. Phát triển Web API (Backend Services)**
  - [x] Cấu hình JWT Authentication, Swagger.
  - [x] Triển khai Controllers: AuthController, ServiceCategoriesController, ServicePlansController.
  - [x] Triển khai phụ trợ: NewsArticlesController, AffiliateApplicationsController.
- [x] **4. Tính năng Nâng cao (Order & QR Code)**
  - [x] Tích hợp thư viện sinh mã QR (`QRCoder`).
  - [x] Xây dựng luồng Order (Tạo đơn hàng, duyệt đơn).

# Giai đoạn 1: Khởi tạo, Thiết kế CSDL & Core Domain (Đã hoàn thành)
- [x] Thiết kế ERD.
- [x] Tạo Entities, Enums, Interfaces.
- [x] Tạo DbContext, FluentAPI, Repository, UoW.
- [x] Tạo Database.

# Giai đoạn 3: Session Management & Idle Timeout (Đã hoàn thành)
- [x] **1. Cập nhật Database & Entity**
  - [x] Tạo entity `UserSession`.
  - [x] Cập nhật `ApplicationDbContext`.
  - [x] Add Migration & Update Database.
- [x] **2. Tầng Application (Auth & User)**
  - [x] Cập nhật DTOs cho Login (thêm Refresh Token).
  - [x] Cập nhật `AuthService`: Login, RefreshToken, Logout.
  - [x] Cập nhật `UserService`: Khóa tài khoản/Đổi mật khẩu revoke session.
- [x] **3. Middleware & API**
  - [x] Tạo `SessionActivityMiddleware`.
  - [x] Đăng ký Middleware vào `Program.cs`.
