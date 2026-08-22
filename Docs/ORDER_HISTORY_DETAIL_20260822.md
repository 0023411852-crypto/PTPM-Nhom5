# Lịch sử và chi tiết đơn hàng khách hàng

**Ngày:** 22/08/2026
**Nhánh:** `Linh-dev-1`
**Phạm vi:** Cho phép khách hàng xem danh sách đơn đã đặt và mở chi tiết từng đơn.

## 1. Phân tích hiện trạng

Client Portal tại `/(main)/client` đã có tab **Lịch sử đơn hàng** và gọi `GET /api/Orders/my-orders`. Danh sách đang hiển thị mã đơn, ngày đặt, tổng tiền và trạng thái; đã có nút thanh toán cho đơn Pending và nút đánh giá cho đơn Completed. Danh sách chưa có nút xem chi tiết.

Backend đã có entity `OrderRequest` với quan hệ tới `ServicePlan`, `PlanPrice`, `Promotion` và `AppUser`, nhưng `OrderDto` hiện chỉ trả ID các quan hệ. Vì vậy frontend không thể hiển thị tên gói, cấu hình hoặc chu kỳ giá từ danh sách hiện tại. Database đã có toàn bộ trường và khóa ngoại cần thiết; không tạo thêm cột hoặc bảng.

## 2. Thay đổi đã thực hiện

| Lớp | Thay đổi |
|---|---|
| Backend DTO | Tạo `OrderDetailDto` chứa tên/mô tả gói, cấu hình, danh mục, chu kỳ, giá, phí setup, tổng tiền, khuyến mãi và ghi chú |
| Backend service | Thêm `GetOrderDetailAsync`, Include `ServicePlan`, `ServicePlan.Category`, `PlanPrice`, `Promotion` |
| API | Thêm `GET /api/Orders/{id:guid}`; chỉ chủ đơn hoặc Admin được xem |
| Frontend | Thêm nút **Xem chi tiết** trong từng đơn hàng |
| Frontend | Thêm modal chi tiết hiển thị thông tin gói, cấu hình, giá, trạng thái và ghi chú |
| Database | Không thay đổi schema, migration hoặc dữ liệu |

## 3. Quy tắc bảo mật

Endpoint lấy chi tiết đọc user ID từ claim đăng nhập. Nếu người gọi không phải Admin và đơn hàng không thuộc user đó, API trả về NotFound để không tiết lộ sự tồn tại của đơn hàng người khác. Ghi chú Admin không trả cho khách hàng.

## 4. Kiểm tra

Đã đối chiếu frontend, `OrdersController`, `IOrderService`, `OrderService`, `OrderRequest`, các entity quan hệ và database. Route dùng ràng buộc `guid` để không xung đột với `/payment-qr`, `/status` hoặc `/approve`. Cần chạy `npx tsc --noEmit`, `npm run build`, `git diff --check` và backend build trên môi trường có .NET SDK.
