/*
  Warnings:

  - You are about to drop the column `name` on the `rekomendasi_destinasi` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "destinations" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "kuliners" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "rekomendasi_destinasi" DROP COLUMN "name",
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;
