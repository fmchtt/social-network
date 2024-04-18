BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [username] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_username_key] UNIQUE NONCLUSTERED ([username])
);

-- CreateTable
CREATE TABLE [dbo].[UserOnServer] (
    [userId] INT NOT NULL,
    [serverId] INT NOT NULL,
    [joinDate] DATETIME2 NOT NULL CONSTRAINT [UserOnServer_joinDate_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [UserOnServer_pkey] PRIMARY KEY CLUSTERED ([userId],[serverId])
);

-- CreateTable
CREATE TABLE [dbo].[Server] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [identifier] NVARCHAR(1000) NOT NULL,
    [ownerId] INT NOT NULL,
    CONSTRAINT [Server_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Channel] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [serverId] INT NOT NULL,
    CONSTRAINT [Channel_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Message] (
    [id] INT NOT NULL IDENTITY(1,1),
    [text] NVARCHAR(1000),
    [file] NVARCHAR(1000),
    [channelId] INT NOT NULL,
    CONSTRAINT [Message_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[UserOnServer] ADD CONSTRAINT [UserOnServer_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[UserOnServer] ADD CONSTRAINT [UserOnServer_serverId_fkey] FOREIGN KEY ([serverId]) REFERENCES [dbo].[Server]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Channel] ADD CONSTRAINT [Channel_serverId_fkey] FOREIGN KEY ([serverId]) REFERENCES [dbo].[Server]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Message] ADD CONSTRAINT [Message_channelId_fkey] FOREIGN KEY ([channelId]) REFERENCES [dbo].[Channel]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
