import { prisma } from "../models/prisma.js";

export const getDestinationsByTipe = async (request, h) => {
  try {
    const { tipe } = request.query;

    let tipeArray = [];
    let isCustomTipe = false;

    // 1. Handle tipe input
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

    // 2. Get all destinations matching the types (case insensitive)
    const allDestinations = await prisma.destinations.findMany({
      where: {
        OR: tipeArray.map((tipeItem) => ({
          tipe: {
            contains: tipeItem,
            mode: "insensitive",
          },
        })),
      },
    });

    // 3. Process randomization and uniqueness
    const usedDestinationIds = new Set();
    const result = [];

    for (const tipeItem of tipeArray) {
      // Filter by tipe (case insensitive) and exclude already used destinations
      const availableDestinations = allDestinations
        .filter(
          (d) =>
            d.tipe.toLowerCase().includes(tipeItem.toLowerCase()) &&
            !usedDestinationIds.has(d.id)
        )
        .sort(() => 0.5 - Math.random()); // Randomize

      // Take max 4 unique destinations
      const selectedDestinations = availableDestinations.slice(0, 4);

      if (selectedDestinations.length > 0) {
        selectedDestinations.forEach((d) => usedDestinationIds.add(d.id));
        result.push({
          tipe: tipeItem,
          destinations: selectedDestinations.map((dest) => ({
            id: dest.id,
            name: dest.name,
            rating: dest.rating,
            tipe: dest.tipe,
            url_gambar: dest.url_gambar,
            provinsi: dest.provinsi,
            kategori: dest.kategori,
            created_at: dest.created_at,
            deskripsi: dest.deskripsi,
            jumlah_review: dest.jumlah_review,
            latitude: dest.latitude,
            longitude: dest.longitude,
            slug: dest.slug,
          })),
        });
      }
    }

    // 4. Handle response
    const response = {
      status: result.length > 0 ? "success" : "false",
      message:
        result.length > 0
          ? "Rekomendasi berhasil dibuat"
          : isCustomTipe
          ? "Tidak ada destinasi yang cocok dengan tipe tersebut"
          : "Data destinasi tidak ada",
      data: result,
    };

    return h.response(response).code(200);
  } catch (error) {
    console.error("Error:", error);
    return h
      .response({
        status: "error",
        message: "Gagal mengambil data destinasi",
        data: [],
      })
      .code(500);
  }
};

export const getDestinationBySlug = async (request, h) => {
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
    const destination = await prisma.destinations.findUnique({
      where: { slug },
    });

    // Handle jika tidak ditemukan
    if (!destination) {
      return h
        .response({
          status: "false",
          message: "Destinasi tidak ditemukan",
          data: null,
        })
        .code(404);
    }

    // Response sukses
    return h
      .response({
        status: "success",
        message: "Detail destinasi berhasil diambil",
        data: destination,
      })
      .code(200);
  } catch (error) {
    console.error("Error:", error);
    return h
      .response({
        status: "error",
        message: "Gagal mengambil data destinasi",
        data: null,
      })
      .code(500);
  }
};
