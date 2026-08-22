# Khóa quyền Admin tự tạo và tự đổi trạng thái đơn hàng

**Ngày:** 22/08/2026
**Nhánh:** `Linh-dev-1`
**Phạm vi:** Loại bỏ thao tác tạo đơn, đổi trạng thái và duyệt thủ công từ Admin Orders.

## Phân tích hiện trạng

Trước thay đổi, Admin Orders có nút **Thêm đơn hàng**, form gọi `POST /api/Orders/admin-create`, form cập nhật trạng thái gọi `PATCH /api/Orders/{id}/status`, và nút **Duyệt cấp VPS** gọi `POST /api/Orders/{id}/approve`. Hai luồng sau có thể trực tiếp thay đổi `OrderRequest.Status` sang trạng thái khác hoặc `Completed`.

Điều này không phù hợp với luồng mới: khách hàng tạo đơn, thanh toán qua MoMo hoặc VietQR, sau đó callback/webhook hợp lệ mới được phép cập nhật trạng thái tự động. Admin không được tự tạo đơn hoặc tự sửa trạng thái.

## Thay đổi

| Thành phần | Thay đổi |
|---|---|
| `OrdersController` | Xóa các endpoint `admin-create`, `PATCH {id}/status` và `POST {id}/approve` |
| `OrderService` | Xóa các method tạo đơn Admin, cập nhật trạng thái thủ công và duyệt thủ công |
| `IOrderService` | Xóa contract tương ứng |
| Admin Orders UI | Xóa nút Thêm đơn hàng, Duyệt cấp VPS, form cập nhật trạng thái và các modal liên quan |
| DTO | Xóa `AdminCreateOrderDto` và `ApproveOrderDto` vì không còn API sử dụng |
| Quyền còn lại | Admin vẫn có thể xem danh sách, xem chi tiết, xuất CSV và xóa đơn theo quyền hiện có |

## Trạng thái thanh toán

Batch này chưa tích hợp callback MoMo/VietQR. Vì vậy chưa tự đánh dấu đơn hoàn tất. Ở batch thanh toán tiếp theo, chỉ handler callback/webhook đã xác thực chữ ký, đúng số tiền và đúng mã đơn mới được cập nhật trạng thái; callback phải idempotent để không xử lý lặp giao dịch.

## Kiểm tra

Đã rà soát tham chiếu toàn repository để bảo đảm các endpoint và handler bị loại bỏ không còn được gọi từ Orders Admin. Cần chạy `npx tsc --noEmit`, `npm run build`, `git diff --check` và kiểm tra backend build trên môi trường có .NET SDK trước khi commit.
