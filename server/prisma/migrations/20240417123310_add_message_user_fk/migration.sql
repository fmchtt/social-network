/*
  Warnings:

  - Added the required column `authorId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Message] ADD [authorId] INT NOT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[Message] ADD CONSTRAINT [Message_authorId_fkey] FOREIGN KEY ([authorId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
