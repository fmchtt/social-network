/*
  Warnings:

  - A unique constraint covering the columns `[identifier]` on the table `Server` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- CreateIndex
ALTER TABLE [dbo].[Server] ADD CONSTRAINT [Server_identifier_key] UNIQUE NONCLUSTERED ([identifier]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
