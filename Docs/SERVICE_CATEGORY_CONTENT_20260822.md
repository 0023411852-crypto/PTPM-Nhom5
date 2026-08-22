# Quản trị nội dung trang chi tiết dịch vụ

**Ngày:** 22/08/2026
**Nhánh:** `Linh-dev-1`
**Phạm vi:** Cho phép Admin thêm/sửa nội dung riêng của các trang chi tiết dịch vụ.

## 1. Phân tích trước khi sửa

Các gói dịch vụ đã có CRUD hoàn chỉnh tại `/admin/services`, bao gồm tên, mô tả, danh mục, thông số, giá, setup fee, trạng thái và QR. Không tạo lại phần đó. Tuy nhiên tiêu đề trang chi tiết, icon và danh sách tính năng đang nằm trong cấu hình frontend, nên Admin chưa thay đổi được.

`ServiceCategory` đã là nơi nhóm các gói theo dịch vụ và đã có CRUD tại `/admin/services/categories`. Đây là vị trí phù hợp nhất để lưu metadata của trang chi tiết, vì mỗi trang chi tiết tương ứng với một danh mục dịch vụ. Do đó batch này mở rộng `ServiceCategory`, không tạo bảng quản trị nội dung mới.

## 2. Dữ liệu bổ sung

| Trường | Kiểu | Mục đích |
|---|---|---|
| `DetailTitle` | `nvarchar(200)` | Tiêu đề hero của trang chi tiết |
| `Icon` | `nvarchar(50)` | Tên Material Symbols icon |
| `FeaturesJson` | `nvarchar(max)` | Mảng JSON các tính năng hiển thị, mỗi dòng một tính năng ở Admin |

Trường `Description` hiện có của `ServiceCategory` được dùng làm mô tả trang chi tiết, nên không tạo trường trùng.

## 3. Thay đổi đã thực hiện

| Lớp | Thay đổi |
|---|---|
| Domain | Mở rộng `ServiceCategory` với ba trường mới |
| DTO | Mở rộng DTO đọc, tạo và cập nhật danh mục |
| EF Core | Cập nhật `ApplicationDbContextModelSnapshot.cs` và tạo migration `20260822103000_AddServiceCategoryDetailContent` |
| SQL | Cập nhật schema tạo mới và thêm đoạn nâng cấp idempotent cho database hiện có |
| Admin | Mở rộng form `/admin/services/categories` để nhập tiêu đề, icon và tính năng |
| Frontend | Các route `/services/[slug]` và `/services/vps` tải metadata danh mục từ API và dùng làm nội dung hiển thị |

## 4. Luồng dữ liệu

Admin lưu thông qua các endpoint CRUD `ServiceCategories` hiện có. AutoMapper truyền các trường mới giữa DTO và entity. Frontend gọi `GET /api/ServiceCategories`, chọn danh mục theo slug hoặc từ khóa dịch vụ, rồi dùng `DetailTitle`, `Description`, `Icon` và `FeaturesJson`. Nếu dữ liệu mới chưa được nhập, frontend dùng fallback hiện có để không làm hỏng trang.

## 5. Kiểm tra

Đã kiểm tra không tạo controller/service/API mới cho nghiệp vụ đã có, không tạo bảng mới ngoài nhu cầu và không sửa CRUD gói dịch vụ. Cần chạy `npx tsc --noEmit`, `npm run build`, `git diff --check` và `dotnet ef database update` trên môi trường có .NET SDK/database trước khi nghiệm thu runtime.
