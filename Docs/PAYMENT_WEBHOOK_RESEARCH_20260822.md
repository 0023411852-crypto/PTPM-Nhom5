# Nghiên cứu callback/webhook thanh toán

## MoMo

Tài liệu MoMo xác nhận IPN là HTTP POST server-to-server tới URL `ipnUrl` do merchant cung cấp. Payload có `partnerCode`, `orderId`, `amount`, `signature`, `transId`, `resultCode`, `requestId` và các trường kết quả khác. Merchant phải phản hồi trong thời hạn yêu cầu, kiểm tra chữ ký và đối chiếu `PartnerCode`, `OrderId`, `Amount` với dữ liệu đã lưu trước khi công nhận giao dịch.

Nguồn: https://developers.momo.vn/v3/vi/docs/payment/api/result-handling/notification/

## VietQR

Tài liệu VietQR phân biệt QR tĩnh, bán động và động. QR động chứa số tiền và mã đơn cụ thể, phù hợp cho từng giao dịch. Dịch vụ VietQR có cơ chế callback/đồng bộ giao dịch trong gói tích hợp; không nên dùng QR tĩnh hiện tại để tự suy đoán thanh toán.

Nguồn: https://doc.vietqr.vn/doc/api-vietqr-callback/api-vietqr-host2host/integrated-document-for-payment-service-vietqr

## SePay cho VietQR chuyển khoản

Tài liệu SePay mô tả luồng: tạo đơn với mã thanh toán duy nhất, đặt mã này vào nội dung chuyển khoản QR, khách chuyển tiền, SePay gửi webhook biến động số dư, server đối chiếu mã và cập nhật đơn đã thanh toán. Đây là phương án phù hợp nếu muốn giữ trải nghiệm quét QR ngân hàng, nhưng cần tài khoản ngân hàng liên kết và webhook URL public.

Nguồn: https://developer.sepay.vn/en/sepay-webhooks/tao-qr-va-form-thanh-toan

## Kết luận triển khai

MoMo có thể tích hợp trực tiếp bằng payment request + IPN callback. VietQR cần chọn một đường xác nhận cụ thể: VietQR Host2Host callback trực tiếp hoặc VietQR QR kết hợp webhook SePay. Không được đánh dấu `Completed` từ redirect frontend; chỉ callback/webhook đã xác thực chữ ký, đúng mã đơn, đúng số tiền và chưa xử lý trước đó mới được cập nhật trạng thái.
