# Phân tích và triển khai đánh giá khách hàng

**Ngày:** 22/08/2026
**Nhánh:** `Linh-dev-1`
**Phạm vi:** Bổ sung khả năng để khách hàng đăng nhập gửi đánh giá trên trang Khách hàng.

## 1. Phân tích trước khi sửa

### Frontend

Trang `cloud-service-frontend/src/app/(main)/top-customers/page.tsx` đã có khu vực **Đánh Giá Từ Khách Hàng**, gọi `GET /api/Users/reviews`, hiển thị số sao, nội dung, avatar và phân trang. Trang chưa có form để khách hàng tạo đánh giá.

### Backend/API

`UsersController` đã có sẵn `POST /api/Users/reviews`. Endpoint yêu cầu người dùng đăng nhập, lấy tên/avatar/chức danh từ tài khoản hiện tại và nhận `Rating`, `Content`, cùng `OrderId` tùy chọn. Khi có `OrderId`, backend kiểm tra đơn hàng thuộc người dùng, ở trạng thái `Completed` và chưa được đánh giá. Vì vậy không tạo controller, service hoặc endpoint mới.

### Database

Entity `CustomerReview`, `DbSet<CustomerReview>`, migration và bảng `CustomerReviews` đã tồn tại. Các trường cần lưu gồm `UserId`, `OrderId`, `Rating`, `Content`, tên người đánh giá, chức danh, avatar, trạng thái hiển thị và thứ tự. DTO `CreateReviewDto` đã có validation rating từ 1 đến 5 và nội dung tối đa 1000 ký tự. Không cần thêm cột, bảng hoặc migration.

### Admin

Hiện chưa có màn hình Admin CRUD riêng cho CustomerReview. Endpoint tạo hiện đặt `IsVisible = true`, nên đánh giá mới được hiển thị công khai ngay sau khi gửi. Việc xây dựng màn hình duyệt/ẩn/xóa đánh giá là một batch riêng, không gộp vào batch form khách hàng để tránh mở rộng phạm vi.

## 2. Thay đổi đã thực hiện

| Lớp | File | Thay đổi |
|---|---|---|
| Frontend khách hàng | `cloud-service-frontend/src/app/(main)/top-customers/page.tsx` | Thêm form chọn 1–5 sao, nhập nội dung tối đa 1000 ký tự và gửi đến API hiện có |
| Frontend khách hàng | Cùng file | Thêm kiểm tra đăng nhập, trạng thái đang gửi, lỗi/thành công, reset form và tải lại danh sách sau khi gửi |
| Backend/DB | Không thay đổi | Tái sử dụng `POST /api/Users/reviews`, entity, DTO, DbContext và migration hiện có |
| Tài liệu | File này | Ghi nhận phân tích, phạm vi và quyết định không tạo cấu trúc trùng |

## 3. Hành vi sau khi sửa

Khách hàng chọn số sao và nhập nội dung rồi bấm **Gửi đánh giá**. Nếu chưa đăng nhập, giao diện báo cần đăng nhập và không gọi API. Nếu đã đăng nhập, frontend gửi Bearer token cùng payload `rating` và `content`. Backend tự gắn thông tin khách hàng từ token, lưu đánh giá và frontend tải lại trang đầu tiên của danh sách testimonial.

## 4. Kiểm tra

Đã đối chiếu FE, API, DTO, controller, entity, DbContext, migration và SQL trước khi sửa. Không phát hiện thiếu cấu trúc dữ liệu. Cần chạy `npx tsc --noEmit`, `npm run build` và `git diff --check` trước khi commit. `dotnet build/test` cần chạy trên môi trường có .NET SDK và database phù hợp.

## 5. Giới hạn được giữ nguyên

Đánh giá không gắn đơn hàng vẫn được phép theo logic endpoint hiện hữu vì `OrderId` là tùy chọn. Đánh giá được hiển thị ngay vì backend hiện đặt `IsVisible = true`. Cơ chế Admin duyệt/ẩn/xóa sẽ được thực hiện ở batch riêng nếu có yêu cầu.
