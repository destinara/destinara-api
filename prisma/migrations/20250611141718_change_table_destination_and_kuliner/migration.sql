/*
  Warnings:

  - You are about to drop the column `latitutde` on the `destinations` table. All the data in the column will be lost.
  - You are about to drop the column `longtitude` on the `destinations` table. All the data in the column will be lost.
  - You are about to drop the column `url_maps` on the `destinations` table. All the data in the column will be lost.
  - You are about to drop the column `gambar` on the `kuliners` table. All the data in the column will be lost.
  - You are about to drop the column `judul` on the `kuliners` table. All the data in the column will be lost.
  - You are about to drop the column `tipe` on the `kuliners` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "destinations" DROP COLUMN "latitutde",
DROP COLUMN "longtitude",
DROP COLUMN "url_maps",
ADD COLUMN     "deskripsi" TEXT,
ADD COLUMN     "jumlah_review" INTEGER,
ADD COLUMN     "latitude" DECIMAL(12,6),
ADD COLUMN     "longitude" DECIMAL(12,6);

-- AlterTable
ALTER TABLE "kuliners" DROP COLUMN "gambar",
DROP COLUMN "judul",
DROP COLUMN "tipe",
ADD COLUMN     "name" TEXT,
ADD COLUMN     "url_gambar" TEXT;
