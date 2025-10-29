-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ABERTO', 'EM_ANDAMENTO', 'RESOLVIDO');

-- AlterTable
ALTER TABLE "Complaint" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ABERTO';
