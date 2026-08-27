-- =============================================
-- CloudServiceDB - Seed Data
-- Chạy SAU KHI đã chạy xong database_script(1).sql
-- SQL Server / SSMS / Azure Data Studio
-- Mật khẩu tài khoản mẫu: 123456
-- Script có thể chạy lại nhiều lần mà không tạo bản ghi trùng.
-- =============================================

SET NOCOUNT ON;
SET XACT_ABORT ON;

BEGIN TRANSACTION;

DECLARE @Now datetime2 = GETUTCDATE();
DECLARE @PasswordHash nvarchar(max) = N'$2b$12$AXTMerjjETHPZWXDX3ki5egWE9DwWJaR/X6rY3ozguvxU.iZXREZm';

-- IDs dùng cố định để liên kết khóa ngoại và chạy seed idempotent.
DECLARE @AdminRoleId uniqueidentifier = '11111111-1111-1111-1111-111111111111';
DECLARE @EditorRoleId uniqueidentifier = '22222222-2222-2222-2222-222222222222';
DECLARE @CustomerRoleId uniqueidentifier = '33333333-3333-3333-3333-333333333333';
DECLARE @AdminUserId uniqueidentifier = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
DECLARE @EditorUserId uniqueidentifier = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
DECLARE @CustomerUserId uniqueidentifier = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
DECLARE @Customer2UserId uniqueidentifier = 'dddddddd-dddd-dddd-dddd-dddddddddddd';
DECLARE @CatVpsId uniqueidentifier = '10000000-0000-0000-0000-000000000001';
DECLARE @CatHostingId uniqueidentifier = '10000000-0000-0000-0000-000000000002';
DECLARE @CatStorageId uniqueidentifier = '10000000-0000-0000-0000-000000000003';
DECLARE @PlanVps1Id uniqueidentifier = '20000000-0000-0000-0000-000000000001';
DECLARE @PlanVps2Id uniqueidentifier = '20000000-0000-0000-0000-000000000002';
DECLARE @PlanHostingId uniqueidentifier = '20000000-0000-0000-0000-000000000003';
DECLARE @PlanStorageId uniqueidentifier = '20000000-0000-0000-0000-000000000004';
DECLARE @PriceVps1MonthId uniqueidentifier = '30000000-0000-0000-0000-000000000001';
DECLARE @PriceVps1YearId uniqueidentifier = '30000000-0000-0000-0000-000000000002';
DECLARE @PriceVps2MonthId uniqueidentifier = '30000000-0000-0000-0000-000000000003';
DECLARE @PriceVps2YearId uniqueidentifier = '30000000-0000-0000-0000-000000000004';
DECLARE @PriceHostingMonthId uniqueidentifier = '30000000-0000-0000-0000-000000000005';
DECLARE @PriceStorageMonthId uniqueidentifier = '30000000-0000-0000-0000-000000000006';
DECLARE @PromotionId uniqueidentifier = '40000000-0000-0000-0000-000000000001';
DECLARE @AffiliateApprovedId uniqueidentifier = '50000000-0000-0000-0000-000000000001';
DECLARE @AffiliatePendingId uniqueidentifier = '50000000-0000-0000-0000-000000000002';
DECLARE @NewsWelcomeId uniqueidentifier = '60000000-0000-0000-0000-000000000001';
DECLARE @NewsSecurityId uniqueidentifier = '60000000-0000-0000-0000-000000000002';
DECLARE @OrderCompletedId uniqueidentifier = '70000000-0000-0000-0000-000000000001';
DECLARE @OrderPendingId uniqueidentifier = '70000000-0000-0000-0000-000000000002';
DECLARE @SessionId uniqueidentifier = '80000000-0000-0000-0000-000000000001';
DECLARE @TicketId uniqueidentifier = '90000000-0000-0000-0000-000000000001';
DECLARE @ReplyId uniqueidentifier = '90000000-0000-0000-0000-000000000002';
DECLARE @CustomerServiceId uniqueidentifier = '90000000-0000-0000-0000-000000000003';
DECLARE @StaticPageId uniqueidentifier = 'a0000000-0000-0000-0000-000000000001';
DECLARE @MediaFileId uniqueidentifier = 'a0000000-0000-0000-0000-000000000002';
DECLARE @PartnerRequestId uniqueidentifier = 'a0000000-0000-0000-0000-000000000003';
DECLARE @SiteSettingId uniqueidentifier = 'a0000000-0000-0000-0000-000000000004';
DECLARE @ReviewId uniqueidentifier = 'a0000000-0000-0000-0000-000000000005';

-- 1. Roles
INSERT INTO [Roles] ([Id], [Name], [CreatedAt], [UpdatedAt])
SELECT v.Id, v.Name, @Now, NULL
FROM (VALUES
    (@AdminRoleId, N'Admin'), (@EditorRoleId, N'Editor'), (@CustomerRoleId, N'Customer')
) v(Id, Name)
WHERE NOT EXISTS (SELECT 1 FROM [Roles] r WHERE r.Id = v.Id);

-- 2. Users. AuthService dùng BCrypt; mật khẩu mẫu là 123456.
INSERT INTO [AppUsers] ([Id], [FullName], [Email], [PasswordHash], [IsActive], [PendingDeletionAt], [RoleId], [CreatedAt], [UpdatedAt], [AvatarUrl], [Company])
SELECT v.Id, v.FullName, v.Email, @PasswordHash, 1, NULL, v.RoleId, @Now, NULL, v.AvatarUrl, v.Company
FROM (VALUES
    (@AdminUserId, N'Nguyễn Quản Trị', N'admin@cloudservice.vn', @AdminRoleId, N'/uploads/admin.png', N'CloudService'),
    (@EditorUserId, N'Trần Biên Tập', N'editor@cloudservice.vn', @EditorRoleId, N'/uploads/editor.png', N'CloudService'),
    (@CustomerUserId, N'Lê Minh Anh', N'customer1@example.com', @CustomerRoleId, N'/uploads/customer1.png', N'Công ty Minh Anh'),
    (@Customer2UserId, N'Phạm Hoàng Nam', N'customer2@example.com', @CustomerRoleId, N'/uploads/customer2.png', N'Nam Digital')
) v(Id, FullName, Email, RoleId, AvatarUrl, Company)
WHERE NOT EXISTS (SELECT 1 FROM [AppUsers] u WHERE u.Id = v.Id);

-- 3. Service categories
INSERT INTO [ServiceCategories] ([Id], [Name], [Description], [Slug], [IsActive], [CreatedAt], [UpdatedAt], [DetailTitle], [Icon], [FeaturesJson])
SELECT v.Id, v.Name, v.Description, v.Slug, 1, @Now, NULL, v.DetailTitle, v.Icon, v.FeaturesJson
FROM (VALUES
    (@CatVpsId, N'Cloud VPS', N'Máy chủ ảo VPS tốc độ cao, ổn định.', N'cloud-vps', N'Hiệu năng cao với ổ cứng NVMe', N'dns', N'["vCPU & RAM linh hoạt", "NVMe siêu tốc", "Root Access toàn quyền", "99.9% Uptime Guarantee"]'),
    (@CatHostingId, N'Web Hosting', N'Hosting doanh nghiệp tối ưu cho website.', N'web-hosting', N'Giải pháp lưu trữ website', N'web', N'["SSD/NVMe Storage", "Free SSL Certificate", "Auto Backup daily", "Integrated Email"]'),
    (@CatStorageId, N'Cloud Storage', N'Lưu trữ dữ liệu an toàn trên nền tảng đám mây.', N'cloud-storage', N'Lưu trữ đám mây an toàn', N'cloud', N'["100GB Storage", "Auto Sync", "File Sharing", "256-bit Encryption"]')
) v(Id, Name, Description, Slug, DetailTitle, Icon, FeaturesJson)
WHERE NOT EXISTS (SELECT 1 FROM [ServiceCategories] c WHERE c.Id = v.Id);

-- 4. Service plans
INSERT INTO [ServicePlans] ([Id], [CategoryId], [Name], [Description], [Specifications], [QRCodeBase64], [IsActive], [CreatedAt], [UpdatedAt])
SELECT v.Id, v.CategoryId, v.Name, v.Description, v.Specifications, NULL, 1, @Now, NULL
FROM (VALUES
    (@PlanVps1Id, @CatVpsId, N'VPS PRO 1', N'Gói Cloud VPS cơ bản.', N'{"CPU":"1 Core","RAM":"1GB","SSD":"20GB","Bandwidth":"100Mbps"}'),
    (@PlanVps2Id, @CatVpsId, N'VPS PRO 2', N'Gói Cloud VPS phổ biến.', N'{"CPU":"2 Core","RAM":"2GB","SSD":"40GB","Bandwidth":"200Mbps"}'),
    (@PlanHostingId, @CatHostingId, N'Business Hosting', N'Hosting doanh nghiệp hiệu năng cao.', N'{"Storage":"10GB","Bandwidth":"Unlimited","SSL":"Free","Email":"50 accounts"}'),
    (@PlanStorageId, @CatStorageId, N'Cloud Storage 100', N'Gói lưu trữ đám mây 100GB.', N'{"Storage":"100GB","Users":"5","Versioning":true,"Sharing":true}')
) v(Id, CategoryId, Name, Description, Specifications)
WHERE NOT EXISTS (SELECT 1 FROM [ServicePlans] p WHERE p.Id = v.Id);

-- 5. Plan prices. BillingCycle: 1 = tháng, 12 = năm.
INSERT INTO [PlanPrices] ([Id], [ServicePlanId], [BillingCycle], [Price], [SetupFee], [CreatedAt], [UpdatedAt])
SELECT v.Id, v.ServicePlanId, v.BillingCycle, v.Price, v.SetupFee, @Now, NULL
FROM (VALUES
    (@PriceVps1MonthId, @PlanVps1Id, 1, CAST(99000 AS decimal(18,2)), CAST(0 AS decimal(18,2))),
    (@PriceVps1YearId, @PlanVps1Id, 12, CAST(1000000 AS decimal(18,2)), CAST(0 AS decimal(18,2))),
    (@PriceVps2MonthId, @PlanVps2Id, 1, CAST(189000 AS decimal(18,2)), CAST(0 AS decimal(18,2))),
    (@PriceVps2YearId, @PlanVps2Id, 12, CAST(2000000 AS decimal(18,2)), CAST(0 AS decimal(18,2))),
    (@PriceHostingMonthId, @PlanHostingId, 1, CAST(149000 AS decimal(18,2)), CAST(0 AS decimal(18,2))),
    (@PriceStorageMonthId, @PlanStorageId, 1, CAST(79000 AS decimal(18,2)), CAST(0 AS decimal(18,2)))
) v(Id, ServicePlanId, BillingCycle, Price, SetupFee)
WHERE NOT EXISTS (SELECT 1 FROM [PlanPrices] p WHERE p.Id = v.Id);

-- 6. Promotions và bảng liên kết nhiều-nhiều PromotionServicePlans.
INSERT INTO [Promotions] ([Id], [Code], [Title], [Description], [Category], [BadgeText], [DiscountPercentage], [StartDate], [EndDate], [IsActive], [IsFeatured], [CreatedAt], [UpdatedAt])
SELECT @PromotionId, N'WELCOME10', N'Ưu đãi khách hàng mới', N'Giảm 10% cho các gói VPS.', N'VPS', N'NEW', 10.00, DATEADD(day, -30, @Now), DATEADD(day, 60, @Now), 1, 1, @Now, NULL
WHERE NOT EXISTS (SELECT 1 FROM [Promotions] WHERE [Id] = @PromotionId);

INSERT INTO [PromotionServicePlans] ([PromotionsId], [ServicePlansId])
SELECT v.PromotionsId, v.ServicePlansId
FROM (VALUES
    (@PromotionId, @PlanVps1Id), (@PromotionId, @PlanVps2Id)
) v(PromotionsId, ServicePlansId)
WHERE NOT EXISTS (SELECT 1 FROM [PromotionServicePlans] p WHERE p.PromotionsId = v.PromotionsId AND p.ServicePlansId = v.ServicePlansId);

-- 7. Affiliate applications
INSERT INTO [AffiliateApplications] ([Id], [UserId], [Status], [WebsiteUrl], [PromotionMethod], [AppliedAt], [CreatedAt], [UpdatedAt])
SELECT v.Id, v.UserId, v.Status, v.WebsiteUrl, v.PromotionMethod, DATEADD(day, v.DaysAgo, @Now), @Now, NULL
FROM (VALUES
    (@AffiliateApprovedId, @CustomerUserId, 1, N'https://minhanh.example.com', N'Blog review công nghệ', 20),
    (@AffiliatePendingId, @Customer2UserId, 0, N'https://hoangnam.example.com', N'Mạng xã hội', 2)
) v(Id, UserId, Status, WebsiteUrl, PromotionMethod, DaysAgo)
WHERE NOT EXISTS (SELECT 1 FROM [AffiliateApplications] a WHERE a.Id = v.Id);

-- 8. News articles. ViewCount có trong schema của database_script(1).sql.
INSERT INTO [NewsArticles] ([Id], [Title], [Content], [Slug], [Category], [ViewCount], [IsPublished], [AuthorId], [CreatedAt], [UpdatedAt])
SELECT v.Id, v.Title, v.Content, v.Slug, v.Category, v.ViewCount, v.IsPublished, v.AuthorId, DATEADD(day, v.DaysAgo, @Now), NULL
FROM (VALUES
    (@NewsWelcomeId, N'CloudService ra mắt nền tảng cloud thế hệ mới', N'Nền tảng CloudService cung cấp VPS, hosting và lưu trữ với khả năng mở rộng linh hoạt.', N'cloudservice-ra-mat-nen-tang-moi', N'Sản phẩm', 125, 1, @EditorUserId, 14),
    (@NewsSecurityId, N'Ba nguyên tắc bảo mật khi vận hành máy chủ cloud', N'Cập nhật hệ điều hành, phân quyền tối thiểu và sao lưu định kỳ là ba nguyên tắc nền tảng.', N'ba-nguyen-tac-bao-mat-may-chu-cloud', N'Bảo mật', 89, 1, @EditorUserId, 5)
) v(Id, Title, Content, Slug, Category, ViewCount, IsPublished, AuthorId, DaysAgo)
WHERE NOT EXISTS (SELECT 1 FROM [NewsArticles] n WHERE n.Id = v.Id);

-- 9. Order requests. OrderStatus: Pending = 0, Processing = 1, Completed = 2, Cancelled = 3.
INSERT INTO [OrderRequests] ([Id], [UserId], [ServicePlanId], [PlanPriceId], [PromotionId], [TotalAmount], [Status], [CustomerNotes], [AdminNotes], [OrderDate], [CreatedAt], [UpdatedAt])
SELECT @OrderCompletedId, @CustomerUserId, @PlanVps2Id, @PriceVps2MonthId, NULL, 189000.00, 2, N'Cài Ubuntu 22.04 và cấu hình firewall cơ bản.', N'Đã kích hoạt VPS.', DATEADD(day, -7, @Now), DATEADD(day, -7, @Now), NULL
WHERE NOT EXISTS (SELECT 1 FROM [OrderRequests] WHERE [Id] = @OrderCompletedId);

INSERT INTO [OrderRequests] ([Id], [UserId], [ServicePlanId], [PlanPriceId], [PromotionId], [TotalAmount], [Status], [CustomerNotes], [AdminNotes], [OrderDate], [CreatedAt], [UpdatedAt])
SELECT @OrderPendingId, @Customer2UserId, @PlanHostingId, @PriceHostingMonthId, NULL, 149000.00, 0, N'Cần hỗ trợ trỏ tên miền sau khi thanh toán.', NULL, DATEADD(day, -1, @Now), DATEADD(day, -1, @Now), NULL
WHERE NOT EXISTS (SELECT 1 FROM [OrderRequests] WHERE [Id] = @OrderPendingId);

-- 10. User sessions
INSERT INTO [UserSessions] ([Id], [UserId], [RefreshTokenHash], [LastActiveTimestamp], [ExpiresAt], [IsRevoked], [RevokedAt], [RevokedReason], [CreatedAt], [UpdatedAt])
SELECT @SessionId, @CustomerUserId, N'seed-refresh-token-hash', DATEADD(hour, -1, @Now), DATEADD(day, 30, @Now), 0, NULL, N'', @Now, NULL
WHERE NOT EXISTS (SELECT 1 FROM [UserSessions] WHERE [Id] = @SessionId);

-- 11. Support tickets và replies
INSERT INTO [SupportTickets] ([Id], [CustomerId], [Title], [Description], [Status], [CreatedAt], [UpdatedAt])
SELECT @TicketId, @Customer2UserId, N'Hỗ trợ trỏ tên miền', N'Tôi cần hướng dẫn trỏ tên miền về hosting mới.', N'Open', DATEADD(day, -1, @Now), NULL
WHERE NOT EXISTS (SELECT 1 FROM [SupportTickets] WHERE [Id] = @TicketId);

INSERT INTO [TicketReplies] ([Id], [TicketId], [UserId], [Message], [CreatedAt], [UpdatedAt])
SELECT @ReplyId, @TicketId, @AdminUserId, N'Bạn vui lòng gửi tên miền, chúng tôi sẽ hỗ trợ cấu hình DNS.', DATEADD(hour, -6, @Now), NULL
WHERE NOT EXISTS (SELECT 1 FROM [TicketReplies] WHERE [Id] = @ReplyId);

-- 12. Customer services
INSERT INTO [CustomerServices] ([Id], [OrderId], [CustomerId], [ServiceName], [VpsIP], [VpsUser], [VpsPassword], [ExpiryDate], [Status], [CreatedAt], [UpdatedAt])
SELECT @CustomerServiceId, @OrderCompletedId, @CustomerUserId, N'VPS PRO 2', N'203.0.113.10', N'cloudadmin', N'ChangeMe_123456', DATEADD(month, 1, @Now), N'Active', DATEADD(day, -7, @Now), NULL
WHERE NOT EXISTS (SELECT 1 FROM [CustomerServices] WHERE [Id] = @CustomerServiceId);

-- 13. Site settings
INSERT INTO [SiteSettings] ([Id], [Key], [Value], [Description], [CreatedAt], [UpdatedAt])
SELECT @SiteSettingId, N'site_name', N'CloudService', N'Tên hiển thị của website.', @Now, NULL
WHERE NOT EXISTS (SELECT 1 FROM [SiteSettings] WHERE [Id] = @SiteSettingId);

-- 14. Static pages
INSERT INTO [StaticPages] ([Id], [Title], [Slug], [Content], [IsPublished], [AuthorId], [CreatedAt], [UpdatedAt])
SELECT @StaticPageId, N'Điều khoản sử dụng', N'dieu-khoan-su-dung', N'Nội dung điều khoản sử dụng dịch vụ CloudService.', 1, @AdminUserId, @Now, NULL
WHERE NOT EXISTS (SELECT 1 FROM [StaticPages] WHERE [Id] = @StaticPageId);

-- 15. Media files
INSERT INTO [MediaFiles] ([Id], [FileName], [FileUrl], [FileSize], [FileType], [CreatedAt], [UpdatedAt])
SELECT @MediaFileId, N'cloudservice-banner.jpg', N'/uploads/cloudservice-banner.jpg', N'245 KB', N'Hình ảnh', @Now, NULL
WHERE NOT EXISTS (SELECT 1 FROM [MediaFiles] WHERE [Id] = @MediaFileId);

-- 16. Partner requests
INSERT INTO [PartnerRequests] ([Id], [FullName], [Email], [WebsiteUrl], [RequestedService], [PromotionMethod], [PromotionDetails], [Status], [Notes], [CreatedAt], [UpdatedAt])
SELECT @PartnerRequestId, N'Công ty TNHH Công nghệ ABC', N'partner@abc.vn', N'https://abc.vn', N'Cloud VPS', N'Blog và mạng xã hội', N'Đánh giá dịch vụ cloud và giới thiệu khách hàng doanh nghiệp.', N'Pending', N'Đang chờ liên hệ.', @Now, NULL
WHERE NOT EXISTS (SELECT 1 FROM [PartnerRequests] WHERE [Id] = @PartnerRequestId);

-- 17. Customer reviews
INSERT INTO [CustomerReviews] ([Id], [ReviewerName], [ReviewerTitle], [ReviewerAvatar], [Rating], [Content], [IsVisible], [SortOrder], [CreatedAt], [UpdatedAt], [OrderId], [UserId])
SELECT @ReviewId, N'Lê Minh Anh', N'Giám đốc Công ty Minh Anh', N'/uploads/customer1.png', 5.00, N'Dịch vụ VPS ổn định, hỗ trợ kỹ thuật nhanh và dễ sử dụng.', 1, 1, @Now, NULL, @OrderCompletedId, @CustomerUserId
WHERE NOT EXISTS (SELECT 1 FROM [CustomerReviews] WHERE [Id] = @ReviewId);

-- 18. Audit log
INSERT INTO [AuditLogs] ([Id], [UserId], [Action], [EntityName], [EntityId], [Details], [Timestamp], [CreatedAt], [UpdatedAt])
SELECT NEWID(), @AdminUserId, N'SEED', N'SeedData', N'initial', N'Đã nạp dữ liệu mẫu cho CloudServiceDB.', @Now, @Now, NULL
WHERE NOT EXISTS (SELECT 1 FROM [AuditLogs] WHERE [EntityName] = N'SeedData' AND [EntityId] = N'initial');

COMMIT TRANSACTION;

SELECT N'Đã nạp dữ liệu mẫu thành công cho 20 bảng nghiệp vụ.' AS [Message];
