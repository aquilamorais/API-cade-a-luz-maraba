/*
  Warnings:

  - You are about to drop the column `img` on the `Complement` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Complaint_userId_key";

-- AlterTable
ALTER TABLE "Complement" DROP COLUMN "img";

-- CreateIndex
CREATE INDEX "Complaint_userId_idx" ON "Complaint"("userId");
