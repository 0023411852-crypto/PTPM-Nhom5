# Báo cáo kiểm tra toàn bộ dự án và đối chiếu đề bài cuối kỳ

**Dự án:** CloudNova – Website bán dịch vụ Cloud

**Nhánh kiểm tra:** `Linh-dev-1`

**Ngày kiểm tra:** 22/08/2026

**Phạm vi:** Rà soát mã nguồn, cấu trúc solution, frontend, backend, database/migration, API, quyền, test, CI/CD, Docker, tài liệu và lịch sử Git; đối chiếu với đề bài cuối kỳ được cung cấp.[1] [2]

## 1. Kết luận điều hành

Dự án đã hình thành đầy đủ khung sản phẩm chính: backend ASP.NET Core Web API theo bốn project Domain–Application–Infrastructure–WebApi, frontend Next.js App Router, cơ sở dữ liệu SQL Server qua EF Core, xác thực JWT/refresh token, phân quyền, CRUD dịch vụ/gói/giá/khuyến mãi/tin tức/trang tĩnh, checkout, lịch sử đơn, dịch vụ khách hàng, đánh giá, đối tác và hỗ trợ. Sau đợt audit, README gốc và cấu hình Docker/Compose đã được hoàn thiện; các phần này vẫn cần được xác minh bằng chạy thực tế trên máy có Docker và .NET SDK.

Các luồng frontend đã được build thành công trong môi trường sandbox. Tuy nhiên, chưa thể khẳng định end-to-end ở runtime vì sandbox không có .NET SDK, backend/database chưa chạy sẵn và frontend hiện gọi API bằng các URL `localhost:5154` hard-code. Vì vậy kết luận dưới đây phân biệt rõ giữa **có mã nguồn**, **đã kiểm tra tĩnh/build**, và **đã chứng minh chạy thực tế**.

Theo yêu cầu trong đề, dự án hiện ở mức **đáp ứng phần lớn chức năng lõi nhưng chưa sẵn sàng để tuyên bố đáp ứng 100%**. Các thiếu hụt lớn nhất trước khi demo/nộp là xác minh thực tế `docker compose up`, CI trên đúng nhánh, kiểm thử backend/coverage, payment thật hoặc mô tả rõ demo payment, và hoàn thiện bằng chứng báo cáo/ERD/design patterns/đóng góp PR.

## 2. Kết quả kiểm tra kỹ thuật

| Hạng mục | Kết quả kiểm tra | Đánh giá |
|---|---|---|
| Backend | 5 project .NET; application/domain/infrastructure/web API; target chính `net8.0` | Có nền tảng Clean Architecture |
| Frontend | Next.js 16.3.1, React 19, TypeScript, App Router | Có và build được |
| ORM/database | EF Core SQL Server, DbContext, migrations, `database_script.sql`, `seed_data.sql` | Có; cần kiểm tra database thật khi chạy |
| API | Nhiều controller cho Auth, Users, Orders, Services, News, Promotions, Partners, Tickets, Dashboard và Settings | Phạm vi API rộng; cần runtime smoke test |
| Authentication | JWT, refresh token, revoke session, BCrypt hash, role Admin/Editor/Customer | Có mã nguồn; cần test runtime và rà soát secret |
| Validation/error | FluentValidation và middleware exception hiện có | Có một phần; cần xác minh mọi lỗi API dùng ProblemDetails chuẩn |
| Frontend quality | `npx tsc --noEmit` pass; `npm run build` pass | Build đạt |
| Lint | `npm run lint` thất bại với 76 lỗi và 48 cảnh báo, gồm nhiều lỗi `react-hooks/set-state-in-effect` | Chưa đạt chất lượng lint |
| Backend build/test | Không chạy được do sandbox không có .NET SDK | Chưa có bằng chứng build/test backend trong môi trường kiểm tra |
| Tests | Có 3 file test chính: `AuthServiceTests.cs`, `UserServiceTests.cs`, `UnitTest1.cs`; tổng số test hiện hữu khoảng 15, trong đó có test mẫu `UnitTest1` | Đủ gần ngưỡng số lượng nhưng chưa có coverage report và chưa chứng minh chạy |
| CI/CD trên nhánh mục tiêu | Không có workflow tracked trong `Linh-dev-1`; GitHub có một workflow run thành công trên branch `Linh-CI/CD` | Chưa đáp ứng chắc chắn cho nhánh cần nộp |
| Docker | Đã có Dockerfile cho Web API/frontend và `docker-compose.yml`; Compose có healthcheck SQL Server và auto-migration có cờ cấu hình | Có cấu hình; chưa xác minh chạy thực tế vì sandbox không có Docker |
| README | Đã bổ sung README gốc với kiến trúc, Docker/local run, database, tài khoản demo, kịch bản demo và giới hạn Demo Payment | Đã cải thiện; cần nhóm kiểm tra lại trên máy sạch |
| Git/PR | Có nhiều commit, nhưng truy vấn PR của repository trả về danh sách rỗng | Có lịch sử commit; chưa có bằng chứng tối thiểu 10 PR/review |
| Logging | Có logging mặc định của ASP.NET; chưa thấy Serilog | Chưa đáp ứng điểm cộng triển khai/logging |

## 3. Đối chiếu yêu cầu chức năng công khai

| Yêu cầu đề bài | Bằng chứng trong code | Mức đáp ứng | Ghi chú |
|---|---|---|---|
| Trang chủ: hero, gói nổi bật, khuyến mãi, uptime, tin mới | `src/app/(main)/page.tsx`, API homepage/content và service plans | Đáp ứng một phần đến khá | Một số nội dung landing vẫn có thể hard-code; cần demo với DB thật |
| Giới thiệu: lịch sử, datacenter, chứng chỉ, SLA | `about/page.tsx`, static pages | Đáp ứng một phần | Cần xác minh dữ liệu quản trị đã được seed đầy đủ |
| Dịch vụ VPS/Hosting/Domain/Email/SSL/Firewall | `services/page.tsx`, các route chi tiết và `ServiceCategory`/`ServicePlan` | Đáp ứng | Card hiện có; trang chi tiết dùng API và dữ liệu gói thật |
| Bảng giá theo chu kỳ, khuyến mãi và đặt hàng | `pricing/page.tsx`, `ServicePlans`, `PlanPrices`, `Promotions`, checkout | Đáp ứng một phần đến khá | Có luồng chính; cần runtime test tính tổng/khuyến mãi |
| Trang khách hàng, testimonial, logo, QR từng gói | `top-customers/page.tsx`, `CustomerReview`, `QRCodeBase64` | Đáp ứng một phần | Có đánh giá, khách VIP, QR; logo khách hàng cần xác nhận dữ liệu hiển thị |
| Tin tức/blog: danh sách, chi tiết, phân trang, tìm kiếm, phân loại | `news/page.tsx`, `news/[id]/page.tsx`, `NewsArticlesController`, server-side `search` | Đáp ứng | Tìm kiếm đã chuyển sang API hiện có; cần test backend runtime |
| Liên hệ/đặt dịch vụ và lưu DB | partners/checkout, `PartnerRequest`, `OrderRequest` | Đáp ứng một phần | Có lưu DB; thanh toán hiện chỉ là Demo Payment |
| Đối tác/affiliate | `partners/page.tsx`, partner/affiliate controllers và Admin pages | Đáp ứng | Có form và quản trị liên quan |

## 4. Đối chiếu yêu cầu Admin

| Yêu cầu đề bài | Hiện trạng | Mức đáp ứng |
|---|---|---|
| Đăng nhập, refresh token, đổi mật khẩu | Auth API, session/refresh token, profile/password pages | Đáp ứng về mã nguồn; cần runtime test |
| CRUD gói + giá + khuyến mãi | `/admin/services`, promotions; ServicePlan/PlanPrice/Promotion APIs | Đáp ứng |
| CRUD danh mục + cấu hình + QR | `/admin/services/categories`, ServiceCategory, QRCodeService | Đáp ứng |
| CRUD tin tức/blog cho Admin, Editor | Admin/Editor article pages và NewsArticles API | Đáp ứng |
| Quản lý yêu cầu đặt dịch vụ/affiliate và đổi trạng thái | Partner/affiliate pages có; Admin Orders đã bị khóa tạo/đổi trạng thái theo quyết định nghiệp vụ gần đây | Đáp ứng một phần và **khác đề** |
| Thống kê theo tháng/gói quan tâm, biểu đồ | `/admin/reports`, Dashboard API | Đáp ứng một phần | Cần runtime kiểm tra dữ liệu và biểu đồ thực tế |
| Xuất yêu cầu ra Excel | Có export CSV/Excel-compatible cho Orders | Đáp ứng một phần | CSV không phải file `.xlsx` qua EPPlus/ClosedXML |
| Audit log đăng nhập/sửa giá | Có `AuditLog`, User activity và các service liên quan | Đáp ứng một phần | Cần kiểm tra mọi thao tác quan trọng có ghi log và Admin UI xem log |
| Admin không tự tạo/đổi đơn | Đã xóa endpoint/UI `admin-create`, `PATCH status`, approve thủ công | Đáp ứng theo yêu cầu nghiệp vụ hiện tại | Điều này cố ý khác dòng yêu cầu Admin đổi trạng thái trong đề gốc |

## 5. Luồng checkout và dịch vụ VPS demo

Luồng hiện tại là: khách tạo đơn, checkout hiển thị QR minh họa, khách bấm **“Tôi đã thanh toán (DEMO)”**, backend kiểm tra quyền sở hữu, chuyển đơn sang `Completed`, tạo `CustomerService` demo và Client Portal tải lại dịch vụ qua `GET /api/CustomerServices/my-services`.

Luồng này phù hợp để trình diễn đồ án nhưng **không phải thanh toán thật**. IP `203.0.113.10` là địa chỉ tài liệu demo; Client Portal đã được chỉnh để hiển thị nhãn **VPS demo** thay vì mở Control Panel giả. Khi chạy production, `DemoPayment.Enabled` phải tắt và cần tích hợp cổng thanh toán/webhook thật trước khi cấp dịch vụ.

## 6. Các rủi ro và lỗi cần ưu tiên

| Mức | Vấn đề | Ảnh hưởng |
|---|---|---|
| Cao | `appsettings.json` chứa JWT secret hard-code và connection string SQL Server gắn với máy `DESKTOP-2BS439P` | Không an toàn và không portable khi deploy |
| Cao | Dockerfile và docker-compose đã có nhưng chưa được chạy xác minh trong môi trường audit | Cần kiểm tra `docker compose up --build` trên máy có Docker |
| Cao | Không có workflow CI tracked trên `Linh-dev-1` | Không chứng minh được CI build/test trên branch nộp |
| Cao | Không chạy được backend test/build trong môi trường audit | Chưa loại trừ lỗi compile/runtime ở C# |
| Trung bình | Frontend gọi trực tiếp `http://localhost:5154` ở nhiều file | Hỏng khi chạy máy khác, container hoặc URL deploy khác |
| Trung bình | `npm run lint` có 76 lỗi và 48 cảnh báo | Chất lượng mã và khả năng bảo trì chưa đạt |
| Trung bình | README đã được bổ sung nhưng chưa được kiểm chứng từ máy sạch | Cần rà soát lại lệnh chạy, tài khoản và kịch bản demo |
| Trung bình | Một số danh sách frontend tải cố định 50/100 bản ghi | Có thể thiếu dữ liệu khi vượt giới hạn |
| Trung bình | CORS `AllowAnyOrigin/AllowAnyMethod/AllowAnyHeader` | Chính sách quá rộng cho production |
| Thấp | Còn `WeatherForecastController` mẫu và `UnitTest1` mẫu | Làm giảm độ hoàn thiện khi review |

## 7. Ma trận đáp ứng tổng hợp

| Nhóm tiêu chí | Đánh giá hiện tại |
|---|---|
| Clean Architecture + SOLID + Design Patterns | **Đáp ứng một phần**: cấu trúc 4 tầng, Repository/Unit of Work/Domain Events có dấu hiệu rõ; cần tài liệu giải thích tối thiểu 3 pattern và trích code |
| Backend API + ORM | **Đáp ứng khá**: nhiều API, EF Core, pagination/filtering; cần build/runtime test và chuẩn hóa ProblemDetails |
| Frontend | **Đáp ứng khá**: nhiều route và luồng chức năng, build pass; lint còn nhiều lỗi và cần kiểm tra responsive thực tế |
| Bảo mật | **Đáp ứng một phần**: JWT/refresh/role/BCrypt/QR có; secret hard-code, CORS rộng và chưa có payment thật là điểm trừ |
| Unit testing | **Đáp ứng một phần**: có khoảng 15 test nhưng chưa có bằng chứng chạy và coverage; còn test mẫu |
| Git teamwork + CI/CD + Docker | **Chưa đáp ứng đầy đủ**: có nhiều commit và nhiều tác giả; chưa có bằng chứng 10 PR, workflow đầy đủ ở branch mục tiêu hoặc chạy Docker thành công |
| Báo cáo/thuyết trình/demo | **Chưa đủ bằng chứng**: có ERD và nhiều tài liệu nội bộ nhưng thiếu README hoàn chỉnh, báo cáo PDF 15–25 trang và slides |
| Deploy thực tế + logging | **Chưa đáp ứng**: chưa thấy deployment và Serilog |

## 8. Checklist bắt buộc trước khi nộp

1. Kiểm tra README, Dockerfile và `docker compose up --build` trên máy có Docker thật; xác nhận database, API và frontend khởi động thành công từ trạng thái sạch.
3. Đưa workflow CI vào đúng branch cần nộp; workflow phải restore, build, test và lưu coverage.
4. Cài .NET SDK đúng phiên bản, chạy `dotnet build CloudServiceSolution.sln` và `dotnet test` thực tế; bổ sung test Domain/Application để có coverage report.
5. Đưa JWT secret, connection string và DemoPayment flag ra environment/user secrets; đổi CORS sang allowlist.
6. Chuẩn hóa API lỗi bằng ProblemDetails và đổi base URL frontend sang biến môi trường.
7. Quyết định rõ trong báo cáo rằng thanh toán là **Demo Payment**; không trình bày như giao dịch thật. Nếu yêu cầu demo thanh toán thật, phải tích hợp cổng có callback/webhook.
8. Chuẩn bị báo cáo PDF, slides, ERD, sơ đồ kiến trúc, giải thích tối thiểu 3 design patterns, phân công thành viên, coverage và kịch bản demo end-to-end.
9. Bổ sung hoặc cung cấp bằng chứng Pull Request/review theo yêu cầu đề bài; không chỉ dựa vào commit trên branch.

## Tài liệu tham chiếu

[1]: https://github.com/0023411852-crypto/PTPM-Nhom5/tree/Linh-dev-1 "Repository PTPM-Nhom5 – branch Linh-dev-1"

[2]: ../upload/de-bai-tap-lon-cuoi-ky.md "Đề bài tập lớn cuối kỳ được cung cấp"
