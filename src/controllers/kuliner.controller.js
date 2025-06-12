import { prisma } from "../models/prisma.js";

export const getKuliners = async (request, h) => {
  try {
    const { provinsi, jumlah_data } = request.query;

    const limit = parseInt(jumlah_data) || 10;

    const whereCondition = provinsi
      ? { provinsi: { equals: provinsi, mode: "insensitive" } }
      : {};

    const kuliners = await prisma.kuliners.findMany({
      where: whereCondition,
      take: limit,
      orderBy: { created_at: "desc" },
    });

    if (kuliners.length === 0) {
      return h
        .response({
          status: "false",
          message: "Tidak ada data kuliner yang ditemukan",
          data: [],
        })
        .code(200);
    }

    return h
      .response({
        status: "success",
        message: "Data kuliner berhasil diambil",
        data: kuliners,
      })
      .code(200);
  } catch (error) {
    console.error("Error fetching kuliners:", error);
    return h
      .response({
        status: "error",
        message: "Gagal mengambil data kuliner",
        data: [],
      })
      .code(500);
  }
};
