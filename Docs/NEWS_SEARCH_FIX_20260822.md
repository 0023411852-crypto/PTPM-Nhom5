# Phân tích và sửa lỗi tìm kiếm News

**Ngày:** 22/08/2026
**Nhánh:** `Linh-dev-1`
**Phạm vi:** Chỉ xử lý lỗi tìm kiếm ở trang News, không sửa các module khác.

## 1. Phân tích trước khi sửa

### Frontend

Trang `cloud-service-frontend/src/app/(main)/news/page.tsx` trước đây tải cố định tối đa 100 bài viết bằng `GET /api/NewsArticles?PageNumber=1&PageSize=100&onlyPublished=true`, sau đó lọc hoàn toàn ở trình duyệt. Vì vậy các bài viết vượt quá 100 bản ghi không thể được tìm thấy. Việc tìm kiếm cũng chỉ xét tiêu đề và nội dung, chưa xét slug, danh mục hoặc các trường hợp người dùng tìm theo tên chuyên mục.

### Backend/API

`NewsArticlesController` đã có sẵn endpoint `GET /api/NewsArticles` và `NewsArticleService` đã có logic lọc bài đã publish, sắp xếp và phân trang. Tuy nhiên API chưa nhận tham số tìm kiếm. Có thể mở rộng chính endpoint này bằng tham số tùy chọn `search`; không cần tạo endpoint mới.

### Database

Entity `NewsArticle`, `DbContext`, migration và bảng `NewsArticles` đã có sẵn các trường `Title`, `Content`, `Slug`, `Category` và `IsPublished`. Tìm kiếm dùng các trường hiện hữu, không cần thêm cột, bảng, migration hoặc thay đổi SQL.

## 2. Thay đổi đã thực hiện

| Lớp | File | Thay đổi |
|---|---|---|
| API contract | `CloudService.Application/Interfaces/INewsArticleService.cs` | Thêm tham số `search` tùy chọn vào contract hiện có |
| Backend service | `CloudService.Application/Services/NewsArticleService.cs` | Lọc server-side theo `Title`, `Content`, `Slug` và `Category`, sau đó mới phân trang |
| Controller | `CloudService.WebApi/Controllers/NewsArticlesController.cs` | Nhận query parameter `search` và truyền vào service hiện có |
| Frontend | `cloud-service-frontend/src/app/(main)/news/page.tsx` | Gửi từ khóa lên API, debounce 250ms, hủy request cũ khi người dùng tiếp tục nhập; vẫn giữ lọc category và lọc cục bộ an toàn |
| Tài liệu | File này | Ghi nhận phân tích, phạm vi và kiểm tra |

## 3. Hành vi sau khi sửa

Khi người dùng nhập từ khóa, frontend chờ 250ms rồi gọi lại endpoint hiện có với `search`. Request trước đó sẽ bị hủy để tránh kết quả cũ ghi đè kết quả mới. Backend tìm trong toàn bộ tập bài viết đã publish trước khi áp dụng phân trang. Khi xóa từ khóa, API được gọi lại với `search` rỗng và danh sách bài viết trở về trạng thái bình thường.

## 4. Kiểm tra

Đã kiểm tra tĩnh các lớp FE, controller, service, entity, DbContext, migration và SQL trước khi sửa. Không phát hiện thiếu bảng hoặc thiếu trường dữ liệu cho chức năng này. Cần chạy `npx tsc --noEmit`, `npm run build` và `git diff --check` trước khi commit. `dotnet build/test` cần được chạy trên môi trường có .NET SDK và database phù hợp.

## 5. Giới hạn còn lại

Tìm kiếm hiện dùng so khớp không phân biệt hoa thường theo chuỗi Unicode của .NET/SQL Server. Chưa thay đổi cơ chế full-text search, ranking hoặc tìm kiếm có trọng số vì đó là một hạng mục khác và không cần thiết để sửa lỗi hiện tại.
