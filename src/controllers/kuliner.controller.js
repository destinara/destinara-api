import { prisma } from "../models/prisma.js";

export const getKuliners = async (request, h) => {
  try {
    const { provinsi, jumlah_data } = request.query;

    const limit = parseInt(jumlah_data) || 10;

    const whereCondition = provinsi
      ? { provinsi: { contains: provinsi, mode: "insensitive" } }
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

export const getKulinersBySlug = async (request, h) => {
  try {
    const { slug } = request.params;

    // Validasi slug
    if (!slug) {
      return h
        .response({
          status: "error",
          message: "Parameter slug diperlukan",
          data: null,
        })
        .code(400);
    }

    // Cari destinasi berdasarkan slug
    const kuliner = await prisma.kuliners.findUnique({
      where: { slug },
    });

    // Handle jika tidak ditemukan
    if (!kuliner) {
      return h
        .response({
          status: "false",
          message: "Kuliner tidak ditemukan",
          data: null,
        })
        .code(404);
    }

    return h
      .response({
        status: "success",
        message: "Data kuliner berhasil diambil",
        data: kuliner,
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
