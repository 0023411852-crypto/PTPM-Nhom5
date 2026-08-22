IF OBJECT_ID(N'[NewsletterSubscribers]', N'U') IS NULL
BEGIN
    CREATE TABLE [NewsletterSubscribers]
    (
        [Id] uniqueidentifier NOT NULL,
        [Email] nvarchar(320) NOT NULL,
        [IsActive] bit NOT NULL CONSTRAINT [DF_NewsletterSubscribers_IsActive] DEFAULT CAST(1 AS bit),
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_NewsletterSubscribers] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = N'IX_NewsletterSubscribers_Email'
      AND object_id = OBJECT_ID(N'[NewsletterSubscribers]')
)
BEGIN
    CREATE UNIQUE INDEX [IX_NewsletterSubscribers_Email]
        ON [NewsletterSubscribers] ([Email]);
END;
GO
