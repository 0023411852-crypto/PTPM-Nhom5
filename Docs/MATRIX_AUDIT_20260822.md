# Báo cáo đối chiếu ma trận đánh giá PTPM-Nhom5

**Ngày kiểm tra:** 22/08/2026
**Branch kiểm tra:** `Linh-dev-fix-20260822`
**Commit hiện tại:** `d5cc39d`
**Nguyên tắc:** Không đánh dấu Đạt chỉ vì có route hoặc file. Mức Đạt trong báo cáo này có nghĩa là đã có luồng code tương ứng và đã vượt qua kiểm tra tĩnh khả dụng; các mục cần database/API đang chạy được ghi rõ là chưa nghiệm thu runtime.

## 1. Kết luận tổng quát

Dự án **chưa thể kết luận hoàn thành toàn bộ ma trận**. Các lỗi giao diện và một số luồng nghiệp vụ chính đã được triển khai, nhưng nhóm nền tảng nộp bài gồm CI, Docker, README, báo cáo, slide, coverage và kiểm thử backend vẫn còn thiếu hoặc chưa có bằng chứng. Ngoài ra, `dotnet build`, `dotnet test` và kiểm thử SQL Server chưa chạy được trong sandbox vì không có .NET SDK và SQL Server.

| Mức đánh giá | Số nhóm | Ý nghĩa |
|---|---:|---|
| Có code/luồng tương ứng | 15 | Đã có triển khai đáng kể; vẫn cần test runtime ở các mục có ghi chú |
| Đạt một phần | 13 | Có một phần code hoặc bằng chứng nhưng thiếu test, UI, chuẩn hóa hoặc nghiệm thu |
| Chưa đạt/thiếu bằng chứng | 9 | Chưa thấy triển khai hoặc chưa có artifact bắt buộc |

## 2. Đối chiếu từng nhóm chức năng và kỹ thuật

| # | Nhóm trong ma trận | Mức | Bằng chứng hiện có | Phần còn thiếu/rủi ro |
|---:|---|---|---|---|
| 1 | SOLID và Design Patterns | Đạt một phần | `CloudService.Application/Services`, `Domain/Interfaces`, `Infrastructure/Repositories/GenericRepository.cs`, Unit of Work và event dispatcher | Chưa có tài liệu trích dẫn ít nhất ba pattern và chưa có test chứng minh thiết kế |
| 2 | REST API, pagination/filter/sorting | Đạt một phần | Nhiều controller dùng `PaginationFilter`; News, PartnerRequests, Orders và ServicePlans có phân trang/lọc | Tên query không hoàn toàn đồng nhất; sorting chưa chuẩn hóa toàn hệ thống; chưa có contract test |
| 3 | ProblemDetails | Đạt một phần | `CloudService.WebApi/Middlewares/ExceptionMiddleware.cs` tạo `ProblemDetails` | Nhiều controller vẫn tự trả `{ message }`; chưa kiểm tra content type và status 400/401/403/404/500 thực tế |
| 4 | QR theo gói dịch vụ | Đạt một phần | `QRCodeService`, `ServicePlanService.BuildQrPayload`, endpoint regenerate, public fallback và FE chuẩn hóa Base64 | Chưa quét QR runtime; cần xác nhận QR chứa đúng cấu hình/giá sau restart API |
| 5 | Landing page | Đạt một phần | Route public, Homepage đã gọi SiteSettings/ServicePlans/Promotions/NewsArticles; Services/About/Pricing có CTA | Chưa test responsive và API/CORS thật; logo khách hàng còn là text tĩnh, nội dung SLA/chứng chỉ chưa lấy dữ liệu quản trị |
| 6 | News/blog | Đạt một phần | `NewsArticlesController`, Admin/Editor pages, public list/detail, search/category/pagination/thumbnail | Chưa nghiệm thu Admin/Editor publish/unpublish end-to-end; rich text/sanitize chưa được chứng minh |
| 7 | CRUD promotion/plan | Đạt một phần | Promotion controller/service/pages; ServicePlan controller/service/pages; many-to-many `PromotionServicePlans` có trong entity/migration/script | Chưa chạy database sạch để xác nhận create/update/delete gắn plan; chưa có integration test |
| 8 | CRUD danh mục và sinh QR | Đạt một phần | ServiceCategories CRUD, ServicePlans CRUD, regenerate QR và payload CPU/RAM/SSD/giá | Chưa kiểm thử sau khi sửa plan/price; QR cũ cần regenerate hoặc fallback; chưa có test tự động |
| 9 | Rich text/Markdown News | Chưa đạt đầy đủ | Có form tạo/sửa bài viết và HTML content render | Chưa xác nhận editor chuyên dụng; `dangerouslySetInnerHTML` cần quy trình sanitize rõ ràng |
| 10 | Dashboard và biểu đồ | Đạt một phần | `AdminService`, `AdminController`, `admin/reports`; Batch 6 đã đồng nhất Completed orders cho doanh thu/số giao dịch/AOV | Chưa xác nhận lọc tháng và biểu đồ bằng dữ liệu thật; chưa có test/report screenshot |
| 11 | Audit log | Đạt một phần | Entity/migration `AuditLog`, event handler và User activities tồn tại | Chưa chứng minh đủ login, sửa giá, đổi trạng thái order; chưa xác nhận trang xem log đầy đủ cho demo |
| 12 | ERD | Đạt một phần | `Docs/erd.md` tồn tại | Chưa đối chiếu/export lại theo migration cuối và chưa có ảnh ERD trong hồ sơ |
| 13 | Unit test | Chưa đạt theo tiêu chí ma trận | Có dấu hiệu test/seed nhưng chưa thấy bộ test nghiệp vụ đạt yêu cầu trong repository audit | Thiếu test payment total, ownership QR, PlanPrice mismatch, auth/role, News publish và export; chưa có coverage |
| 14 | Xuất Excel | Đạt một phần | `GET /api/Orders/export`, Admin-only, CSV UTF-8 BOM và nút `Xuất CSV` đã có ở Admin Orders | Ma trận yêu cầu `.xlsx`/EPPlus/ClosedXML; hiện mới là CSV tương thích Excel, chưa có workbook test |
| 15 | GitHub Actions | Chưa đạt | Không thấy `.github/workflows` | Cần workflow restore/build/test backend và typecheck/build frontend |
| 16 | Dockerfile API | Chưa đạt | Không thấy Dockerfile API | Cần multi-stage .NET 8, port, environment và healthcheck |
| 17 | docker-compose + SQL Server | Chưa đạt | Có `database_script.sql` nhưng không thấy compose | Cần API + SQL Server, volume, healthcheck, environment và hướng dẫn migration/seed |
| 18 | Serilog | Chưa đạt | Chưa thấy package/cấu hình `UseSerilog` | Cần logging có cấu hình và cấm log token/password/secret |
| 19 | README | Chưa đạt | README gốc chưa có nội dung triển khai đủ theo ma trận | Cần kiến trúc, yêu cầu môi trường, env, migration/seed, tài khoản demo, Swagger, Docker và CI |
| 20 | Review/testimonial | Đạt một phần | `CustomerReview` entity, migration, `UsersController/reviews`, public `top-customers` có testimonial/pagination | Chưa có quy trình Admin quản lý review; chưa có test và chưa xác nhận schema/code/seed trên database sạch |
| 21 | PR/review GitHub | Chưa đạt bằng chứng | Repository được chọn có branch/commit nhưng chưa có bằng chứng PR thực chất theo feature/review chéo | Cần tạo PR thực chất, review chéo và ghi đóng góp thành viên; không tạo PR rỗng |
| 22 | Báo cáo PDF | Chưa đạt | Chưa thấy báo cáo 15–25 trang | Cần tạo báo cáo có kiến trúc, ERD, API, test, ảnh demo, CI/Docker |
| 23 | Slides/demo | Chưa đạt | Chưa thấy slide/kịch bản | Cần slide 15 phút, demo end-to-end và kịch bản lỗi |
| 24 | Coverage report | Chưa đạt | Chưa thấy artifact coverage | Cần chạy coverage và đưa kết quả vào báo cáo |
| 25 | Deploy cloud/VPS | Chưa đạt/không bắt buộc lõi | Chưa thấy cấu hình/link deploy | Chỉ làm sau Docker/CI ổn định nếu cần điểm cộng |

## 3. Kiểm tra các điểm lệch schema trong ma trận

| Điểm kiểm tra | Kết quả hiện tại | Kết luận |
|---|---|---|
| `CustomerReviews` | Có entity, DbSet/migration và endpoint reviews trong `UsersController` | Không còn là thiếu entity/controller, nhưng thiếu Admin CRUD và test |
| `PromotionServicePlans` | Có quan hệ many-to-many trong migration/snapshot/script và service promotion gắn plan | Cần chạy database sạch để xác nhận mapping/runtime |
| `ThumbnailUrl` | Có trong DTO/entity, migration và `Seeder/Program.cs` | Có vẻ đồng bộ; cần test seed/detail ảnh thật |
| SQL script và migration cuối | Có `database_script.sql` và nhiều migration | Chưa chạy so sánh tự động; cần chọn migration làm nguồn chính và test database sạch |
| Newsletter | Không còn entity/controller/service/SQL Newsletter trong branch hiện tại | **Đúng yêu cầu người dùng: không khôi phục Newsletter** |

## 4. Các commit sửa lỗi chính đã có trên branch

| Commit | Nội dung |
|---|---|
| `6e6765b` | About, News, auth, avatar và checkout FE |
| `bb571f5` + `eb4fd51` | Backend order total; Newsletter sau đó đã được revert |
| `d9249e4` | QR Service Plan và setup phần QR |
| `d59650e` | Validation promotion |
| `c5c1a16` | Hợp nhất route Affiliate về PartnerRequests |
| `88e4a55` | Đồng nhất report metrics theo Completed orders |
| `c590d4e` | Export CSV tương thích Excel |
| `bc81d6f` | Sửa CTA trang Services |
| `fae6be2` | Dữ liệu động Homepage |
| `41d956b` | Sửa lưu regenerate QR tránh update navigation graph |
| `f9622dd` | Render QR trên trang Khách hàng |
| `d2e0e1f` | Fallback QR khi dữ liệu cũ null và cân đối layout |
| `7391078` | Chuẩn hóa Base64 QR thành data URI |
| `d5cc39d` | Thêm CPU/RAM/SSD vào payload QR |

## 5. Thứ tự cần làm tiếp để đạt ma trận

**P1 — nền tảng trước khi demo:** tạo test backend và chạy `dotnet build/test`; chuẩn hóa ProblemDetails; kiểm tra database sạch và migration/seed; tạo GitHub Actions; viết README; tạo Dockerfile/compose; hoàn thiện review Admin CRUD và audit log.

**P2 — nghiệm thu nghiệp vụ:** test News publish/search/detail/thumbnail, promotion gắn plan, QR sau khi sửa giá, dashboard theo tháng, ownership payment QR và export file. Các test này phải có ảnh hoặc log kết quả để làm bằng chứng.

**P3 — hồ sơ nộp:** cập nhật ERD và ảnh, chạy coverage, viết báo cáo 15–25 trang, chuẩn bị slide/kịch bản demo và tạo PR review chéo. Deploy chỉ thực hiện sau khi local, Docker và CI ổn định.

## 6. Kết luận

Các batch trước đã giải quyết phần lớn lỗi UI được nêu ban đầu và bổ sung nhiều luồng nghiệp vụ quan trọng. Tuy nhiên, theo đúng tiêu chuẩn của file ma trận, dự án **chưa xong toàn bộ hạng mục chính** vì còn thiếu hoặc chưa có bằng chứng cho CI, Docker, README, test/coverage, báo cáo/slide, logging và nghiệm thu runtime backend. Không nên ghi “100% hoàn thành” cho tới khi các mốc trong mục 5 được chạy và lưu bằng chứng.
