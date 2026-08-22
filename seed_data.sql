-- =============================================
-- Script: Dữ liệu mẫu (Seed Data) cho CloudServiceDB
-- Hướng dẫn: Chạy script này SAU KHI đã chạy file database_script.sql
-- =============================================

-- 1. Thêm các Roles
DECLARE @AdminRoleId UNIQUEIDENTIFIER = NEWID();
DECLARE @EditorRoleId UNIQUEIDENTIFIER = NEWID();
DECLARE @CustomerRoleId UNIQUEIDENTIFIER = NEWID();

INSERT INTO [Roles] ([Id], [Name], [CreatedAt], [UpdatedAt])
VALUES 
(@AdminRoleId, 'Admin', GETUTCDATE(), NULL),
(@EditorRoleId, 'Editor', GETUTCDATE(), NULL),
(@CustomerRoleId, 'Customer', GETUTCDATE(), NULL);

-- 2. Thêm Service Category (Danh mục Dịch vụ)
DECLARE @CatVpsId UNIQUEIDENTIFIER = NEWID();
DECLARE @CatHostingId UNIQUEIDENTIFIER = NEWID();

INSERT INTO [ServiceCategories] ([Id], [Name], [Description], [Slug], [IsActive], [CreatedAt], [UpdatedAt])
VALUES 
(@CatVpsId, 'Cloud VPS', 'Máy chủ ảo VPS tốc độ cao', 'cloud-vps', 1, GETUTCDATE(), NULL),
(@CatHostingId, 'Web Hosting', 'Hosting doanh nghiệp', 'web-hosting', 1, GETUTCDATE(), NULL);

-- 3. Thêm Service Plan (Gói Dịch vụ)
DECLARE @PlanVps1Id UNIQUEIDENTIFIER = NEWID();
DECLARE @PlanVps2Id UNIQUEIDENTIFIER = NEWID();

INSERT INTO [ServicePlans] ([Id], [CategoryId], [Name], [Description], [Specifications], [IsActive], [CreatedAt], [UpdatedAt], [QRCodeBase64])
VALUES 
(@PlanVps1Id, @CatVpsId, 'VPS PRO 1', 'Gói Cloud VPS cơ bản', '{"CPU": "1 Core", "RAM": "1GB", "SSD": "20GB"}', 1, GETUTCDATE(), NULL, NULL),
(@PlanVps2Id, @CatVpsId, 'VPS PRO 2', 'Gói Cloud VPS phổ biến', '{"CPU": "2 Core", "RAM": "2GB", "SSD": "40GB"}', 1, GETUTCDATE(), NULL, NULL);

-- 4. Thêm Plan Price (Bảng giá)
INSERT INTO [PlanPrices] ([Id], [ServicePlanId], [BillingCycle], [Price], [SetupFee], [CreatedAt], [UpdatedAt])
VALUES 
-- Giá cho VPS PRO 1
(NEWID(), @PlanVps1Id, 1, 99000, 0, GETUTCDATE(), NULL),    -- 1 tháng
(NEWID(), @PlanVps1Id, 12, 1000000, 0, GETUTCDATE(), NULL), -- 12 tháng (Tiết kiệm)
-- Giá cho VPS PRO 2
(NEWID(), @PlanVps2Id, 1, 189000, 0, GETUTCDATE(), NULL),
(NEWID(), @PlanVps2Id, 12, 2000000, 0, GETUTCDATE(), NULL);
