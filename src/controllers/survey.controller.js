import axios from "axios";
import jwt from "jsonwebtoken";
import { prisma } from "../models/prisma.js";

export const handleSurveyRecommendation = async (request, h) => {
  const { aktifitas } = request.payload;
  const { max_recom = 5, treshold = 0.5 } = request.query;

  const authHeader = request.headers.authorization;

  console.log(authHeader);

  console.log(authHeader);
  if (!authHeader) {
    return h
      .response({ status: "false", message: "Token tidak ditemukan", data: [] })
      .code(401);
  }

  let user_id;
  try {
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    user_id = decoded.id;
  } catch (err) {
    return h
      .response({ status: "false", message: "Token tidak valid", data: [] })
      .code(401);
  }

  if (!aktifitas) {
    return h
      .response({
        status: "false",
        message: "Aktifitas tidak boleh kosong",
        data: [],
      })
      .code(400);
  }

  try {
    const response = await axios.post(
      "https://destinasi.arialog.my.id/recommendation",
      {
        user_survey: aktifitas,
      },
      {
        params: {
          max_recom,
          treshold,
        },
      }
    );

    const rekomendasiList = response.data?.data || [];

    if (rekomendasiList.length === 0) {
      return h
        .response({
          status: "false",
          message: "Tidak ada rekomendasi yang ditemukan",
          data: [],
        })
        .code(404);
    }

    await Promise.all(
      rekomendasiList.map((item) =>
        prisma.rekomendasi_destinasi.create({
          data: {
            user_id,
            kategori: item.tipe_destinasi,
            score: Math.round(item.score * 100),
          },
        })
      )
    );

    return h
      .response({
        status: "success",
        message: "Rekomendasi berhasil dibuat",
        data: rekomendasiList,
      })
      .code(200);
  } catch (error) {
    console.error("Error saat fetch AI:", error.message);
    return h
      .response({
        status: "false",
        message: "Terjadi kesalahan saat memproses rekomendasi",
        data: [],
      })
      .code(500);
  }
};

export const getRekomendasiByUserId = async (request, h) => {
  try {
    const { id } = request.query;

    if (!id) {
      return h
        .response({
          status: "error",
          message: "Parameter id diperlukan",
        })
        .code(400);
    }

    const userId = parseInt(id);
    if (isNaN(userId)) {
      return h
        .response({
          status: "error",
          message: "ID harus berupa angka",
        })
        .code(400);
    }

    // Langsung ambil data rekomendasi tanpa cek user
    const rekomendasi = await prisma.rekomendasi_destinasi.findMany({
      where: { user_id: userId },
      select: {
        kategori: true, // Hanya ambil kolom kategori
      },
    });

    if (rekomendasi.length === 0) {
      return h
        .response({
          status: "success",
          message:
            "Belum ada rekomendasi untuk user ini silahkan survey terlebih dahulu",
        })
        .code(200);
    }

    // Ekstrak hanya nilai kategori ke dalam array
    const kategoriList = rekomendasi.map((item) => item.kategori);

    return h
      .response({
        status: "success",
        message: "Data rekomendasi berhasil diambil",
        data: kategoriList,
      })
      .code(200);
  } catch (error) {
    console.error("Error:", error);
    return h
      .response({
        status: "error",
        message: "Terjadi kesalahan server",
      })
      .code(500);
  }
};
