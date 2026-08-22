# Nhật ký triển khai theo batch

## Quy tắc làm việc

Mỗi batch chỉ xử lý **một hạng mục nhỏ**. Trước khi sửa, phải đối chiếu đủ bốn lớp: giao diện FE, controller/API, service/repository và entity/DbContext/migration/SQL. Nếu một lớp đã có chức năng, không viết lại hoặc tạo endpoint trùng.

Mỗi batch phải có commit riêng, chỉ stage đúng các file thuộc phạm vi, chạy kiểm tra phù hợp, cập nhật file này và push lên branch `Linh-dev-fix-20260822`. Không đưa Newsletter trở lại vì luồng này đã được yêu cầu loại bỏ.

## Baseline

| Nội dung | Giá trị |
|---|---|
| Branch nguồn | `Linh-dev` |
| Branch triển khai | `Linh-dev-fix-20260822` |
| Commit baseline | `2c2e624` |
| Trạng thái baseline | Working tree sạch |
| Phạm vi không được sửa lại | Các luồng đã hoàn tất nếu không có lỗi mới được chứng minh |

## Batch 0 — Khóa quy trình và audit CRUD danh mục

### Phạm vi đã kiểm tra

Đã kiểm tra các file và lớp sau trước khi quyết định sửa:

| Lớp | Kết quả |
|---|---|
| FE | `cloud-service-frontend/src/app/admin/services/page.tsx` có CRUD gói và dùng danh mục trong `<select>`, nhưng chưa có màn hình tạo/sửa/xóa danh mục riêng |
| API | `ServiceCategoriesController` đã có GET list/detail, POST, PUT và DELETE; các lệnh ghi yêu cầu role `Admin` |
| Service | `ServiceCategoryService` đã có GetAll, GetById, Create, Update và Delete qua `IUnitOfWork.Repository<ServiceCategory>` |
| Database | Entity/category repository và DbContext đã tồn tại; chưa cần tạo entity hoặc endpoint mới cho batch này |
| Gói/giá | `ServicePlansController` và `ServicePlanService` đã có CRUD; không sửa trong batch CRUD danh mục |
| QR | Chưa có endpoint QR riêng cho catalog gói; không sửa trong batch CRUD danh mục |

### Kết luận trước khi sửa

Batch CRUD danh mục **chỉ thiếu giao diện FE**, không thiếu API hoặc database. Vì vậy batch code tiếp theo chỉ được sửa `admin/services/page.tsx` hoặc tạo một page category riêng nếu cần; không được tạo controller, service, entity, DbSet hoặc migration mới.

### Phạm vi đề xuất cho Batch 1

Chỉ bổ sung giao diện quản lý danh mục tại Admin, gồm danh sách danh mục, tạo, sửa, xóa, loading/error/empty state và gọi các endpoint đã có. Cần giữ nguyên giao diện CRUD gói đang dùng danh mục. Chưa làm QR, khuyến mãi, affiliate, Excel hoặc landing page trong batch này.

### Tiêu chí nghiệm thu Batch 1

1. Admin xem được danh sách category từ `GET /api/ServiceCategories`.
2. Admin tạo được category bằng `POST /api/ServiceCategories`.
3. Admin sửa được category bằng `PUT /api/ServiceCategories/{id}`.
4. Admin xóa được category bằng `DELETE /api/ServiceCategories/{id}`.
5. User không có role Admin không thể thực hiện thao tác ghi.
6. Sau khi tạo/sửa/xóa, danh sách category và select category của form gói được cập nhật.
7. Không thay đổi controller/service/entity/database và không tạo file migration.
8. TypeScript và diff check pass; commit chỉ chứa file FE cần thiết và file Markdown này.

## Trạng thái

- Batch 0: **Hoàn tất phân tích, chưa sửa code chức năng**.
- Batch 1 CRUD danh mục: **Đã hoàn tất và đã push** (`82f198b`).
- QR theo gói: Chưa bắt đầu.
- Batch 2 QR theo gói: **Đã hoàn tất và đã push** (`d9249e4`).
- Batch 3 setup fee bảng giá: **Đã hoàn tất và đã push** (`537e51c`).
- Batch 4 validation thời hạn khuyến mãi: **Đã hoàn tất và đã push** (`d59650e`).
- Batch 5 Affiliate/PartnerRequests: **Đã hoàn tất và đã push** (`c5c1a16`).
- Batch 6 thống kê báo cáo: **Đã hoàn tất và đã push** (`88e4a55`).
- Batch 7 export danh sách đơn hàng: **Đã hoàn tất và đã push** (`c590d4e`).
- Batch 8 hợp nhất route Affiliate: **Đã triển khai, kiểm thử pass và chuẩn bị commit**.
- Các batch khác: Chưa bắt đầu.

## Batch 1 — Giao diện CRUD danh mục dịch vụ

### File đã sửa

| File | Nội dung |
|---|---|
| `cloud-service-frontend/src/app/admin/services/categories/page.tsx` | Tạo màn hình danh sách, tạo, sửa, xóa danh mục bằng các endpoint `ServiceCategories` hiện có |
| `cloud-service-frontend/src/app/admin/services/page.tsx` | Thêm nút điều hướng sang màn hình quản lý danh mục |
| `Docs/IMPLEMENTATION_PROGRESS.md` | Cập nhật nhật ký batch |

### Giới hạn giữ nguyên

Không sửa controller, service, entity, DbContext, migration, SQL, gói dịch vụ, QR, khuyến mãi hoặc affiliate. Không tạo lại API và không thêm Newsletter.

### Kiểm tra cần thực hiện

- `npx tsc --noEmit` trong `cloud-service-frontend`.
- `git diff --check`.
- Xác nhận chỉ hai file FE và file Markdown được stage.
- Kiểm tra patch không có file backend/database ngoài phạm vi.

## Batch 2 — Sinh lại và xem QR theo gói dịch vụ

### Phân tích trước khi sửa

`ServicePlan.QRCodeBase64` đã tồn tại trong entity và `ServicePlanDto` đã trả trường này; `QRCodeService` cũng đã có hàm sinh Base64. Vì vậy batch này không cần thêm entity, DbSet, migration hoặc SQL. Backend chỉ thiếu contract service và endpoint Admin; frontend chỉ thiếu nút gọi endpoint và modal xem QR.

### File đã sửa

| File | Nội dung |
|---|---|
| `CloudService.Application/Interfaces/IServicePlanService.cs` | Thêm contract `RegenerateQrCodeAsync` |
| `CloudService.Application/Services/ServicePlanService.cs` | Sinh payload từ ID/tên/mức giá hiện tại, tạo Base64 QR và lưu `QRCodeBase64` |
| `CloudService.WebApi/Controllers/ServicePlansController.cs` | Thêm `POST /api/ServicePlans/{id}/regenerate-qr`, chỉ role Admin |
| `cloud-service-frontend/src/app/admin/services/page.tsx` | Thêm cột QR, nút sinh lại, xem QR và cập nhật state |
| `Docs/IMPLEMENTATION_PROGRESS.md` | Cập nhật nhật ký batch |

### Giới hạn và nghiệm thu

Batch này không thay đổi create/update DTO, database schema, QR thanh toán order hoặc các luồng public. QR catalog có payload gói và giá hiện tại; khi giá thay đổi, Admin bấm sinh lại để tạo mã mới. TypeScript và `git diff --check` đã pass. `dotnet build` chưa chạy được vì sandbox không có .NET SDK; cần chạy trên máy local có SDK.

## Batch 3 — Hoàn thiện bảng giá và phí khởi tạo

### Phân tích trước khi sửa

`PlanPrice` và DTO tạo/cập nhật giá đã có trường `Price` và `SetupFee`; backend `ServicePlanService` đã map và lưu `SetupFee`. Thiếu sót chỉ nằm ở UI Admin: form không cho nhập setup fee và payload FE không gửi giá trị này, khiến phí khởi tạo bị mặc định về 0 khi tạo/sửa từ giao diện.

### File đã sửa

| File | Nội dung |
|---|---|
| `cloud-service-frontend/src/app/admin/services/page.tsx` | Thêm setup fee tháng/năm vào state, form, payload và dữ liệu edit |
| `Docs/IMPLEMENTATION_PROGRESS.md` | Cập nhật nhật ký batch |

### Giới hạn và nghiệm thu

Không sửa backend, entity, DbContext, migration hoặc API. Không đụng QR, promotion hay checkout. `npx tsc --noEmit` và `git diff --check` đã pass; chỉ một file frontend và file Markdown thuộc phạm vi.

## Batch 4 — Validation thời hạn khuyến mãi

### Phân tích trước khi sửa

Backend đã có entity, DTO, service và controller CRUD promotion; form Admin đang tái sử dụng form Editor. Thiếu sót nhỏ được xác định là form cho phép gửi ngày kết thúc trước ngày bắt đầu và phần trăm giảm giá ngoài khoảng 0–100. Batch này chỉ bổ sung validation ở form hiện có, không tạo API hoặc thay đổi schema.

### File đã sửa

| File | Nội dung |
|---|---|
| `cloud-service-frontend/src/app/editor/promotions/create/page.tsx` | Kiểm tra ngày bắt đầu/kết thúc, phần trăm giảm giá và hiển thị lỗi inline trước khi gửi API |
| `Docs/IMPLEMENTATION_PROGRESS.md` | Cập nhật nhật ký batch |

### Giới hạn và nghiệm thu

Không sửa controller, service, entity, DbContext, migration hoặc payload API. `npx tsc --noEmit` và `git diff --check` đã pass. Ngày kết thúc để trống vẫn hợp lệ; nếu có giá trị thì bắt buộc phải sau ngày bắt đầu.

## Batch 5 — Kết nối Admin Affiliate với PartnerRequests API

### Phân tích trước khi sửa

Route `admin/affiliates` đang chứa dữ liệu mẫu cố định và chỉ cập nhật trạng thái trong React state, nên thao tác duyệt hoặc từ chối bị mất sau khi tải lại trang. Backend đã có sẵn `PartnerRequestsController`, `IPartnerRequestService`, `PartnerRequestService` và các endpoint `GET /api/PartnerRequests` cùng `PATCH /api/PartnerRequests/{id}/status`. Endpoint đọc và cập nhật đều yêu cầu role `Admin`; trạng thái hợp lệ theo luồng hiện tại là `Pending`, `Approved` và `Rejected`.

Dự án đồng thời đã có trang `admin/partner-requests` kết nối đúng API, có tìm kiếm, lọc trạng thái, phân trang và modal cập nhật trạng thái. Vì vậy không tạo API hoặc viết lại nghiệp vụ. Route Affiliate cũ được chuyển sang tái sử dụng trang Partner Requests chuẩn để loại bỏ dữ liệu hard-code và tránh hai màn hình quản lý cùng một luồng.

### File đã sửa

| File | Nội dung |
|---|---|
| `cloud-service-frontend/src/app/admin/affiliates/page.tsx` | Thay toàn bộ dữ liệu mẫu và cập nhật state cục bộ bằng việc tái sử dụng `admin/partner-requests/page.tsx`, giữ nguyên URL cũ |
| `Docs/IMPLEMENTATION_PROGRESS.md` | Ghi lại phân tích, API contract và phạm vi Batch 5 |

### Giới hạn và nghiệm thu

Không sửa backend, entity, DTO, database hoặc migration vì API và logic approve/reject đã tồn tại và phù hợp. `npx tsc --noEmit` và `git diff --check` đã pass. Route `/admin/affiliates` hiện dùng dữ liệu server; route menu chính `/admin/partner-requests` vẫn hoạt động độc lập với cùng nghiệp vụ.

## Batch 6 — Đồng nhất công thức thống kê báo cáo Admin

### Phân tích trước khi sửa

`AdminController` và `AdminService` đã có API `GET /api/Admin/revenue-report`; trang `admin/reports` cũng đã gọi API thật. Tuy nhiên doanh thu chỉ tính đơn `Completed`, trong khi số giao dịch và AOV lại tính toàn bộ đơn trong kỳ, bao gồm `Pending`, `Rejected` hoặc trạng thái chưa hoàn tất. Điều này làm các chỉ số không cùng một tập dữ liệu.

### File đã sửa

| File | Nội dung |
|---|---|
| `CloudService.Application/Services/AdminService.cs` | Tạo tập `currentCompletedOrders` và `previousCompletedOrders`; dùng chúng cho doanh thu, số giao dịch, AOV và tỷ trọng dịch vụ |
| `Docs/IMPLEMENTATION_PROGRESS.md` | Cập nhật nhật ký Batch 6 |

### Giới hạn và nghiệm thu

Không thay đổi endpoint, DTO, database, migration hoặc giao diện. `git diff --check` đã pass. Không chạy được `dotnet build` trong sandbox vì máy không có .NET SDK; cần chạy lệnh build trên máy local có SDK. Nút `Xuất báo cáo` hiện vẫn là placeholder và được giữ lại cho batch Excel riêng, không giả vờ đã hoàn thành.

## Batch 7 — Xuất danh sách đơn hàng tương thích Excel

### Phân tích trước khi sửa

Ma trận yêu cầu có chức năng xuất danh sách yêu cầu đặt dịch vụ. `OrdersController` đã có `GET /api/Orders/all` cho Admin nhưng chưa có endpoint download; nút xuất báo cáo trong trang thống kê chỉ là placeholder. Không có package `EPPlus`, `ClosedXML` hoặc thư viện Spreadsheet nào trong repository. Để giữ batch nhỏ và không thêm dependency chưa thể build trong sandbox, batch này triển khai file CSV UTF-8 có BOM, mở trực tiếp bằng Excel, với dữ liệu đơn hàng không nhạy cảm.

### File đã sửa

| File | Nội dung |
|---|---|
| `CloudService.Application/Interfaces/IOrderService.cs` | Thêm contract `ExportAllOrdersCsvAsync` |
| `CloudService.Application/Services/OrderService.cs` | Xuất toàn bộ đơn hàng theo ngày giảm dần; escape CSV và dùng invariant decimal format |
| `CloudService.WebApi/Controllers/OrdersController.cs` | Thêm `GET /api/Orders/export`, chỉ role `Admin`, trả file CSV UTF-8 |
| `cloud-service-frontend/src/app/admin/orders/page.tsx` | Thêm nút `Xuất CSV`, gửi Authorization và tải file blob |
| `Docs/IMPLEMENTATION_PROGRESS.md` | Cập nhật nhật ký Batch 7 |

### Giới hạn và nghiệm thu

Batch này không sửa entity, database, migration hoặc luồng tạo/duyệt đơn. File chứa ID đơn, ID khách hàng, ID gói, ID bảng giá, tổng tiền, trạng thái và ngày đặt; không chứa mật khẩu, thông tin cấp VPS hoặc dữ liệu nhạy cảm. `npx tsc --noEmit` và `git diff --check` đã pass. `dotnet build` chưa chạy được vì sandbox không có .NET SDK; cần chạy trên máy local. Đây là CSV tương thích Excel, chưa phải định dạng `.xlsx` dùng EPPlus/ClosedXML.

## Batch 8 — Hợp nhất các route Affiliate về PartnerRequests

### Phân tích trước khi sửa

Dự án có hai entity/backend model là `PartnerRequest` và `AffiliateApplication`. Tuy nhiên public form tại `/(main)/partners/page.tsx` gửi đăng ký tới `POST /api/PartnerRequests`, còn trang Admin `partner-requests` đã có đầy đủ GET, tìm kiếm, lọc, phân trang và cập nhật trạng thái bằng API thật. Hai route Admin `affiliates` và `partners` trước đó lại chứa các màn hình legacy khác nhau, trong đó `partners` đọc `AffiliateApplications`, khiến dữ liệu đăng ký từ public form không xuất hiện nhất quán.

Không xóa entity hoặc API legacy vì chưa có migration dữ liệu và có thể còn client cũ sử dụng. Chỉ hợp nhất các route FE về màn hình `admin/partner-requests`, chọn `PartnerRequests` làm luồng hiển thị/quản trị chính theo contract của public form.

### File đã sửa

| File | Nội dung |
|---|---|
| `cloud-service-frontend/src/app/admin/affiliates/page.tsx` | Giữ route cũ nhưng dùng màn hình PartnerRequests chuẩn |
| `cloud-service-frontend/src/app/admin/partners/page.tsx` | Loại bỏ màn hình AffiliateApplications legacy, dùng cùng màn hình PartnerRequests |
| `Docs/IMPLEMENTATION_PROGRESS.md` | Cập nhật nhật ký Batch 8 |

### Giới hạn và nghiệm thu

Không xóa `AffiliateApplication`, controller, service, database hoặc migration. Không thay đổi public form. Sau batch này, đăng ký từ `/partners` và cả các route Admin Affiliate/Partners đều hiển thị trong cùng luồng PartnerRequests; approve/reject được lưu server-side. Cần chạy `npx tsc --noEmit` và `git diff --check` trước khi commit.
