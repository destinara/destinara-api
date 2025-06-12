import { prisma } from "../models/prisma.js";
export const getDestinationsByTipe = async (request, h) => {
  try {
    const { tipe } = request.query;

    let tipeArray = [];
    let isCustomTipe = false;

    if (tipe) {
      isCustomTipe = true;
      tipeArray = tipe.split(",").map((t) => t.trim());
    } else {
      const allTipes = await prisma.destinations.findMany({
        where: { tipe: { not: null } },
        distinct: ["tipe"],
        select: { tipe: true },
      });
      tipeArray = allTipes.map((item) => item.tipe);
    }

    const result = await Promise.all(
      tipeArray.map(async (tipeItem) => {
        const destinations = await prisma.destinations.findMany({
          where: { tipe: tipeItem },
          take: 4,
          orderBy: { rating: "desc" },
        });

        return destinations.length > 0
          ? { tipe: tipeItem, destinations }
          : null;
      })
    );

    const filteredResult = result.filter((r) => r !== null);

    // Default success response
    let response = {
      status: "success",
      message: "Rekomendasi berhasil dibuat",
      data: filteredResult,
    };

    // Kalau kosong, ubah jadi false dan ganti message
    if (filteredResult.length === 0) {
      response.status = "false";
      response.message = isCustomTipe
        ? "Tidak ada destinasi yang cocok dengan tipe tersebut"
        : "Data destinasi tidak ada";
    }

    return h.response(response).code(200);
  } catch (error) {
    console.error("Error fetching destinations by tipe:", error);
    return h
      .response({
        status: "error",
        message: "Gagal mengambil data destinasi",
        data: [],
      })
      .code(500);
  }
};
