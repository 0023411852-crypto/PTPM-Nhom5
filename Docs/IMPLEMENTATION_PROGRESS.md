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
- Batch 2 QR theo gói: **Đã triển khai, đang kiểm thử và chuẩn bị commit**.
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
