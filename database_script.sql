IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260810120325_InitialCreate'
)
BEGIN
    CREATE TABLE [Roles] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_Roles] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260810120325_InitialCreate'
)
BEGIN
    CREATE TABLE [ServiceCategories] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [Slug] nvarchar(max) NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_ServiceCategories] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260810120325_InitialCreate'
)
BEGIN
    CREATE TABLE [AppUsers] (
        [Id] uniqueidentifier NOT NULL,
        [FullName] nvarchar(max) NOT NULL,
        [Email] nvarchar(max) NOT NULL,
        [PasswordHash] nvarchar(max) NOT NULL,
        [IsActive] bit NOT NULL,
        [RoleId] uniqueidentifier NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_AppUsers] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_AppUsers_Roles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [Roles] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260810120325_InitialCreate'
)
BEGIN
    CREATE TABLE [ServicePlans] (
        [Id] uniqueidentifier NOT NULL,
        [CategoryId] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [Specifications] nvarchar(max) NOT NULL,
        [QRCodeBase64] nvarchar(max) NULL,
        [IsActive] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_ServicePlans] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_ServicePlans_ServiceCategories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [ServiceCategories] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260810120325_InitialCreate'
)
BEGIN
    CREATE TABLE [AffiliateApplications] (
        [Id] uniqueidentifier NOT NULL,
        [UserId] uniqueidentifier NOT NULL,
        [Status] int NOT NULL,
        [WebsiteUrl] nvarchar(max) NOT NULL,
        [PromotionMethod] nvarchar(max) NOT NULL,
        [AppliedAt] datetime2 NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_AffiliateApplications] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_AffiliateApplications_AppUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AppUsers] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260810120325_InitialCreate'
)
BEGIN
    CREATE TABLE [AuditLogs] (
        [Id] uniqueidentifier NOT NULL,
        [UserId] uniqueidentifier NOT NULL,
        [Action] nvarchar(max) NOT NULL,
        [EntityName] nvarchar(max) NOT NULL,
        [EntityId] nvarchar(max) NOT NULL,
        [Details] nvarchar(max) NOT NULL,
        [Timestamp] datetime2 NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_AuditLogs] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_AuditLogs_AppUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AppUsers] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260810120325_InitialCreate'
)
BEGIN
    CREATE TABLE [NewsArticles] (
        [Id] uniqueidentifier NOT NULL,
        [Title] nvarchar(max) NOT NULL,
        [Content] nvarchar(max) NOT NULL,
        [Slug] nvarchar(max) NOT NULL,
        [Category] nvarchar(max) NOT NULL,
        [IsPublished] bit NOT NULL,
        [AuthorId] uniqueidentifier NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_NewsArticles] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_NewsArticles_AppUsers_AuthorId] FOREIGN KEY ([AuthorId]) REFERENCES [AppUsers] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260810120325_InitialCreate'
)
BEGIN
    CREATE TABLE [PlanPrices] (
        [Id] uniqueidentifier NOT NULL,
        [ServicePlanId] uniqueidentifier NOT NULL,
        [BillingCycle] int NOT NULL,
        [Price] decimal(18,2) NOT NULL,
        [SetupFee] decimal(18,2) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_PlanPrices] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_PlanPrices_ServicePlans_ServicePlanId] FOREIGN KEY ([ServicePlanId]) REFERENCES [ServicePlans] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260810120325_InitialCreate'
)
BEGIN
    CREATE TABLE [Promotions] (
        [Id] uniqueidentifier NOT NULL,
        [ServicePlanId] uniqueidentifier NOT NULL,
        [Code] nvarchar(max) NOT NULL,
        [DiscountPercentage] decimal(5,2) NOT NULL,
        [StartDate] datetime2 NOT NULL,
        [EndDate] datetime2 NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_Promotions] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Promotions_ServicePlans_ServicePlanId] FOREIGN KEY ([ServicePlanId]) REFERENCES [ServicePlans] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260810120325_InitialCreate'
)
BEGIN
    CREATE TABLE [OrderRequests] (
        [Id] uniqueidentifier NOT NULL,
        [UserId] uniqueidentifier NOT NULL,
        [ServicePlanId] uniqueidentifier NOT NULL,
        [PlanPriceId] uniqueidentifier NOT NULL,
        [PromotionId] uniqueidentifier NULL,
        [TotalAmount] decimal(18,2) NOT NULL,
        [Status] int NOT NULL,
        [CustomerNotes] nvarchar(max) NULL,
        [AdminNotes] nvarchar(max) NULL,
        [OrderDate] datetime2 NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_OrderRequests] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_OrderRequests_AppUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AppUsers] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_OrderRequests_PlanPrices_PlanPriceId] FOREIGN KEY ([PlanPriceId]) REFERENCES [PlanPrices] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_OrderRequests_Promotions_PromotionId] FOREIGN KEY ([PromotionId]) REFERENCES [Promotions] ([Id]) ON DELETE SET NULL,
        CONSTRAINT [FK_OrderRequests_ServicePlans_ServicePlanId] FOREIGN KEY ([ServicePlanId]) REFERENCES [ServicePlans] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260810120325_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_AffiliateApplications_UserId] ON [AffiliateApplications] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260810120325_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_AppUsers_RoleId] ON [AppUsers] ([RoleId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260810120325_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_AuditLogs_UserId] ON [AuditLogs] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260810120325_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_NewsArticles_AuthorId] ON [NewsArticles] ([AuthorId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260810120325_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_OrderRequests_PlanPriceId] ON [OrderRequests] ([PlanPriceId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260810120325_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_OrderRequests_PromotionId] ON [OrderRequests] ([PromotionId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260810120325_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_OrderRequests_ServicePlanId] ON [OrderRequests] ([ServicePlanId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260810120325_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_OrderRequests_UserId] ON [OrderRequests] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260810120325_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_PlanPrices_ServicePlanId] ON [PlanPrices] ([ServicePlanId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260810120325_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Promotions_ServicePlanId] ON [Promotions] ([ServicePlanId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260810120325_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_ServicePlans_CategoryId] ON [ServicePlans] ([CategoryId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260810120325_InitialCreate'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260810120325_InitialCreate', N'8.0.0');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260811045011_AddUserSession'
)
BEGIN
    CREATE TABLE [UserSessions] (
        [Id] uniqueidentifier NOT NULL,
        [UserId] uniqueidentifier NOT NULL,
        [RefreshTokenHash] nvarchar(max) NOT NULL,
        [LastActiveTimestamp] datetime2 NOT NULL,
        [ExpiresAt] datetime2 NOT NULL,
        [IsRevoked] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_UserSessions] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_UserSessions_AppUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AppUsers] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260811045011_AddUserSession'
)
BEGIN
    CREATE INDEX [IX_UserSessions_UserId] ON [UserSessions] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260811045011_AddUserSession'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260811045011_AddUserSession', N'8.0.0');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260811052327_UpdateUserSessionAudit'
)
BEGIN
    ALTER TABLE [UserSessions] ADD [RevokedAt] datetime2 NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260811052327_UpdateUserSessionAudit'
)
BEGIN
    ALTER TABLE [UserSessions] ADD [RevokedReason] nvarchar(max) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260811052327_UpdateUserSessionAudit'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260811052327_UpdateUserSessionAudit', N'8.0.0');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260820081154_AddSupportAndServices'
)
BEGIN
    CREATE TABLE [CustomerServices] (
        [Id] uniqueidentifier NOT NULL,
        [OrderId] uniqueidentifier NOT NULL,
        [CustomerId] uniqueidentifier NOT NULL,
        [ServiceName] nvarchar(max) NOT NULL,
        [VpsIP] nvarchar(max) NOT NULL,
        [VpsUser] nvarchar(max) NOT NULL,
        [VpsPassword] nvarchar(max) NOT NULL,
        [ExpiryDate] datetime2 NOT NULL,
        [Status] nvarchar(max) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_CustomerServices] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_CustomerServices_AppUsers_CustomerId] FOREIGN KEY ([CustomerId]) REFERENCES [AppUsers] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_CustomerServices_OrderRequests_OrderId] FOREIGN KEY ([OrderId]) REFERENCES [OrderRequests] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260820081154_AddSupportAndServices'
)
BEGIN
    CREATE TABLE [SiteSettings] (
        [Id] uniqueidentifier NOT NULL,
        [Key] nvarchar(max) NOT NULL,
        [Value] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_SiteSettings] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260820081154_AddSupportAndServices'
)
BEGIN
    CREATE TABLE [SupportTickets] (
        [Id] uniqueidentifier NOT NULL,
        [CustomerId] uniqueidentifier NOT NULL,
        [Title] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [Status] nvarchar(max) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_SupportTickets] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_SupportTickets_AppUsers_CustomerId] FOREIGN KEY ([CustomerId]) REFERENCES [AppUsers] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260820081154_AddSupportAndServices'
)
BEGIN
    CREATE TABLE [TicketReplies] (
        [Id] uniqueidentifier NOT NULL,
        [TicketId] uniqueidentifier NOT NULL,
        [UserId] uniqueidentifier NOT NULL,
        [Message] nvarchar(max) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_TicketReplies] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_TicketReplies_AppUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AppUsers] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_TicketReplies_SupportTickets_TicketId] FOREIGN KEY ([TicketId]) REFERENCES [SupportTickets] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260820081154_AddSupportAndServices'
)
BEGIN
    CREATE INDEX [IX_CustomerServices_CustomerId] ON [CustomerServices] ([CustomerId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260820081154_AddSupportAndServices'
)
BEGIN
    CREATE INDEX [IX_CustomerServices_OrderId] ON [CustomerServices] ([OrderId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260820081154_AddSupportAndServices'
)
BEGIN
    CREATE INDEX [IX_SupportTickets_CustomerId] ON [SupportTickets] ([CustomerId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260820081154_AddSupportAndServices'
)
BEGIN
    CREATE INDEX [IX_TicketReplies_TicketId] ON [TicketReplies] ([TicketId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260820081154_AddSupportAndServices'
)
BEGIN
    CREATE INDEX [IX_TicketReplies_UserId] ON [TicketReplies] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260820081154_AddSupportAndServices'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260820081154_AddSupportAndServices', N'8.0.0');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260820165958_AddPendingDeletionToUser'
)
BEGIN
    ALTER TABLE [AppUsers] ADD [PendingDeletionAt] datetime2 NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260820165958_AddPendingDeletionToUser'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260820165958_AddPendingDeletionToUser', N'8.0.0');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260820171521_AddThumbnailToArticle'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260820171521_AddThumbnailToArticle', N'8.0.0');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260820174147_AddStaticPages'
)
BEGIN
    CREATE TABLE [StaticPages] (
        [Id] uniqueidentifier NOT NULL,
        [Title] nvarchar(255) NOT NULL,
        [Slug] nvarchar(255) NOT NULL,
        [Content] nvarchar(max) NOT NULL,
        [IsPublished] bit NOT NULL,
        [AuthorId] uniqueidentifier NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_StaticPages] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_StaticPages_AppUsers_AuthorId] FOREIGN KEY ([AuthorId]) REFERENCES [AppUsers] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260820174147_AddStaticPages'
)
BEGIN
    CREATE INDEX [IX_StaticPages_AuthorId] ON [StaticPages] ([AuthorId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260820174147_AddStaticPages'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260820174147_AddStaticPages', N'8.0.0');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260820175915_UpdatePromotionsForMarketing'
)
BEGIN
    DECLARE @var0 sysname;
    SELECT @var0 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Promotions]') AND [c].[name] = N'ServicePlanId');
    IF @var0 IS NOT NULL EXEC(N'ALTER TABLE [Promotions] DROP CONSTRAINT [' + @var0 + '];');
    ALTER TABLE [Promotions] ALTER COLUMN [ServicePlanId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260820175915_UpdatePromotionsForMarketing'
)
BEGIN
    DECLARE @var1 sysname;
    SELECT @var1 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Promotions]') AND [c].[name] = N'EndDate');
    IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [Promotions] DROP CONSTRAINT [' + @var1 + '];');
    ALTER TABLE [Promotions] ALTER COLUMN [EndDate] datetime2 NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260820175915_UpdatePromotionsForMarketing'
)
BEGIN
    ALTER TABLE [Promotions] ADD [BadgeText] nvarchar(50) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260820175915_UpdatePromotionsForMarketing'
)
BEGIN
    ALTER TABLE [Promotions] ADD [Category] nvarchar(50) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260820175915_UpdatePromotionsForMarketing'
)
BEGIN
    ALTER TABLE [Promotions] ADD [Description] nvarchar(max) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260820175915_UpdatePromotionsForMarketing'
)
BEGIN
    ALTER TABLE [Promotions] ADD [IsFeatured] bit NOT NULL DEFAULT CAST(0 AS bit);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260820175915_UpdatePromotionsForMarketing'
)
BEGIN
    ALTER TABLE [Promotions] ADD [Title] nvarchar(255) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260820175915_UpdatePromotionsForMarketing'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260820175915_UpdatePromotionsForMarketing', N'8.0.0');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260820181227_AddMediaFiles'
)
BEGIN
    CREATE TABLE [MediaFiles] (
        [Id] uniqueidentifier NOT NULL,
        [FileName] nvarchar(255) NOT NULL,
        [FileUrl] nvarchar(max) NOT NULL,
        [FileSize] nvarchar(50) NOT NULL,
        [FileType] nvarchar(50) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_MediaFiles] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260820181227_AddMediaFiles'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260820181227_AddMediaFiles', N'8.0.0');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260820182125_AddViewCountToNewsArticle'
)
BEGIN
    ALTER TABLE [NewsArticles] ADD [ViewCount] int NOT NULL DEFAULT 0;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260820182125_AddViewCountToNewsArticle'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260820182125_AddViewCountToNewsArticle', N'8.0.0');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260821050103_AddPartnerRequests'
)
BEGIN
    CREATE TABLE [PartnerRequests] (
        [Id] uniqueidentifier NOT NULL,
        [FullName] nvarchar(max) NOT NULL,
        [Email] nvarchar(max) NOT NULL,
        [WebsiteUrl] nvarchar(max) NOT NULL,
        [PromotionMethod] nvarchar(max) NOT NULL,
        [PromotionDetails] nvarchar(max) NOT NULL,
        [Status] nvarchar(max) NOT NULL,
        [Notes] nvarchar(max) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_PartnerRequests] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260821050103_AddPartnerRequests'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260821050103_AddPartnerRequests', N'8.0.0');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260821095836_AddCustomerReviews'
)
BEGIN
    ALTER TABLE [AppUsers] ADD [AvatarUrl] nvarchar(max) NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260821095836_AddCustomerReviews'
)
BEGIN
    ALTER TABLE [AppUsers] ADD [Company] nvarchar(max) NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260821095836_AddCustomerReviews'
)
BEGIN
    CREATE TABLE [CustomerReviews] (
        [Id] uniqueidentifier NOT NULL,
        [ReviewerName] nvarchar(max) NOT NULL,
        [ReviewerTitle] nvarchar(max) NOT NULL,
        [ReviewerAvatar] nvarchar(max) NOT NULL,
        [Rating] decimal(18,2) NOT NULL,
        [Content] nvarchar(max) NOT NULL,
        [IsVisible] bit NOT NULL,
        [SortOrder] int NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_CustomerReviews] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260821095836_AddCustomerReviews'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260821095836_AddCustomerReviews', N'8.0.0');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260821104300_UpdatePromotionServicePlans'
)
BEGIN
    ALTER TABLE [Promotions] DROP CONSTRAINT [FK_Promotions_ServicePlans_ServicePlanId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260821104300_UpdatePromotionServicePlans'
)
BEGIN
    DROP INDEX [IX_Promotions_ServicePlanId] ON [Promotions];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260821104300_UpdatePromotionServicePlans'
)
BEGIN
    DECLARE @var2 sysname;
    SELECT @var2 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Promotions]') AND [c].[name] = N'ServicePlanId');
    IF @var2 IS NOT NULL EXEC(N'ALTER TABLE [Promotions] DROP CONSTRAINT [' + @var2 + '];');
    ALTER TABLE [Promotions] DROP COLUMN [ServicePlanId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260821104300_UpdatePromotionServicePlans'
)
BEGIN
    CREATE TABLE [PromotionServicePlans] (
        [PromotionsId] uniqueidentifier NOT NULL,
        [ServicePlansId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_PromotionServicePlans] PRIMARY KEY ([PromotionsId], [ServicePlansId]),
        CONSTRAINT [FK_PromotionServicePlans_Promotions_PromotionsId] FOREIGN KEY ([PromotionsId]) REFERENCES [Promotions] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_PromotionServicePlans_ServicePlans_ServicePlansId] FOREIGN KEY ([ServicePlansId]) REFERENCES [ServicePlans] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260821104300_UpdatePromotionServicePlans'
)
BEGIN
    CREATE INDEX [IX_PromotionServicePlans_ServicePlansId] ON [PromotionServicePlans] ([ServicePlansId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260821104300_UpdatePromotionServicePlans'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260821104300_UpdatePromotionServicePlans', N'8.0.0');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260821113720_AddCustomerReviewUserAndOrder'
)
BEGIN
    ALTER TABLE [CustomerReviews] ADD [OrderId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260821113720_AddCustomerReviewUserAndOrder'
)
BEGIN
    ALTER TABLE [CustomerReviews] ADD [UserId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260821113720_AddCustomerReviewUserAndOrder'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260821113720_AddCustomerReviewUserAndOrder', N'8.0.0');
END;
GO

COMMIT;
GO

