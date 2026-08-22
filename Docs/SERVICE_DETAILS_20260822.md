# Phân tích và triển khai trang chi tiết dịch vụ

**Ngày:** 22/08/2026
**Nhánh:** `Linh-dev-1`
**Phạm vi:** Mở rộng luồng từ các card dịch vụ sang trang chi tiết dùng dữ liệu thật.

## 1. Phân tích trước khi sửa

Trang `/(main)/services` trước đây có sáu card dịch vụ. Chỉ Cloud VPS đã có route chi tiết `/services/vps`; các card Hosting, Domain, Email, SSL và Security đều trỏ chung về `/pricing`, nên chưa có phần mô tả chi tiết theo từng dịch vụ.

Backend đã có `GET /api/ServicePlans` và DTO `ServicePlanDto` trả về tên, mô tả, `Specifications`, danh mục, trạng thái hoạt động và danh sách giá. `ServicePlanService` đã Include `Prices,Category` khi đọc dữ liệu. Admin cũng đã có `/admin/services` với chức năng thêm, sửa, xóa gói và `/admin/services/categories` để quản lý danh mục. Vì vậy không cần tạo API, entity, bảng, migration hoặc màn hình Admin mới cho batch này.

## 2. Thay đổi đã thực hiện

| Hạng mục | Thay đổi |
|---|---|
| Route dùng chung | Tạo `/(main)/services/[slug]/page.tsx` cho Hosting, Domain, Email, SSL và Security |
| Dữ liệu gói | Gọi `GET /api/ServicePlans?PageNumber=1&PageSize=100`, chỉ lấy gói active, lọc theo danh mục/từ khóa dịch vụ |
| Nội dung chi tiết | Mô tả và các trường cấu hình trong `Specifications` lấy từ ServicePlans; giá lấy từ `Prices` đang active |
| Tư vấn | Mỗi trang có hai nút tư vấn và modal liên hệ; hotline/email lấy từ `GET /api/SiteSettings/public` với fallback |
| Liên kết card | Đổi link Hosting, Domain, Email, SSL và Security sang route chi tiết tương ứng |
| Database | Không thay đổi vì toàn bộ dữ liệu cần thiết đã có trong ServicePlans, ServiceCategories, PlanPrices và SiteSettings |

## 3. Quy tắc lọc dữ liệu

Slug được ánh xạ vào cấu hình hiển thị của từng dịch vụ. Gói được chọn khi tên danh mục, tên gói hoặc mô tả chứa từ khóa tương ứng. Nếu không có gói khớp, giao diện hiển thị trạng thái chưa có gói thay vì tự tạo dữ liệu giả. Các thông tin giới thiệu và tính năng nền chỉ là nội dung mô tả giao diện; tên gói, mô tả, thông số và giá trong phần danh sách đều lấy từ API.

## 4. Admin hiện có

Admin đã có khả năng thêm/sửa/xóa gói tại `/admin/services`, thay đổi danh mục tại `/admin/services/categories`, cập nhật giá tháng/năm, setup fee, trạng thái active và QR. Vì vậy các trang chi tiết mới sẽ tự phản ánh dữ liệu gói sau khi Admin cập nhật mà không cần sửa frontend từng lần.

## 5. Kiểm tra

Đã kiểm tra toàn bộ liên kết card, TypeScript, production build và `git diff --check`. Không thêm API hoặc thay đổi schema database. Cần chạy backend runtime với API thật để xác nhận tên category trong database khớp các từ khóa lọc; nếu tên category khác, trang vẫn hiển thị trạng thái rỗng thay vì hiển thị sai dữ liệu.
