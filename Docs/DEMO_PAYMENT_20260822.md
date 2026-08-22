# Demo Payment – Xác nhận thanh toán mô phỏng

**Ngày:** 22/08/2026
**Nhánh:** `Linh-dev-1`
**Mục đích:** Phục vụ bài kết thúc môn khi chưa có tài khoản merchant MoMo/VietQR.

## Luồng

Khách hàng đăng nhập, tạo đơn từ checkout, sau đó bấm **Tôi đã thanh toán (DEMO)**. Frontend gọi `POST /api/Orders/{id}/demo-payment` cho các đơn vừa tạo trong giỏ hàng. Backend chỉ cho phép endpoint hoạt động khi `DemoPayment:Enabled=true`, kiểm tra đơn thuộc tài khoản đang đăng nhập, đổi trạng thái sang `Completed` và tạo `CustomerService` mô phỏng.

Thông tin cấp phát mô phỏng dùng dải tài liệu `203.0.113.10`, tài khoản `demo-user` và mật khẩu được tạo từ mã đơn. Đây không phải VPS thật và không được dùng để kết nối máy chủ thật.

## Chống xử lý lặp

Backend kiểm tra `CustomerService.OrderId` trước khi tạo dịch vụ. Nếu khách bấm lại, API trả lại dịch vụ đã tạo với `AlreadyProcessed=true`, không tạo bản ghi mới.

## Cấu hình

`CloudService.WebApi/appsettings.Development.json` bật:

```json
{
  "DemoPayment": {
    "Enabled": true
  }
}
```

Production không có cấu hình này nên mặc định endpoint bị tắt. Khi tích hợp MoMo/VietQR thật, cần thay endpoint demo bằng payment session và callback/webhook đã xác thực, không bật Demo Payment trên production.

## Kiểm tra

Đã kiểm tra quyền sở hữu đơn ở service, chống cấp phát lặp theo `OrderId`, hỗ trợ nhiều đơn trong một giỏ hàng ở frontend, và giữ endpoint Admin tạo/đổi trạng thái đã bị loại bỏ từ commit trước.
