/*
  Warnings:

  - You are about to drop the column `list_kategori` on the `rekomendasi_destinasi` table. All the data in the column will be lost.
  - Added the required column `kategori` to the `rekomendasi_destinasi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rekomendasi_destinasi" DROP COLUMN "list_kategori",
ADD COLUMN     "kategori" TEXT NOT NULL,
ADD COLUMN     "score" INTEGER;
