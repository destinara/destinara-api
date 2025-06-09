-- CreateTable
CREATE TABLE "destinations" (
    "id" SERIAL NOT NULL,
    "url_maps" TEXT,
    "name" TEXT,
    "rating" DECIMAL(12,2),
    "tipe" TEXT,
    "url_gambar" TEXT,
    "provinsi" TEXT,
    "latitutde" DECIMAL(12,2),
    "longtitude" DECIMAL(12,2),
    "kategori" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "destinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kuliners" (
    "id" SERIAL NOT NULL,
    "judul" TEXT,
    "deskripsi" TEXT,
    "gambar" TEXT,
    "tipe" TEXT,
    "provinsi" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "kuliners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rekomendasi_destinasi" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" TEXT,
    "list_kategori" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "rekomendasi_destinasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "gender" TEXT,
    "password" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "rekomendasi_destinasi" ADD CONSTRAINT "rekomendasi_destinasi_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
