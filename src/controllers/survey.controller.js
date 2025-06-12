import axios from "axios";
import jwt from "jsonwebtoken";
import { prisma } from "../models/prisma.js";

export const handleSurveyRecommendation = async (request, h) => {
  const { aktifitas } = request.payload;
  const { max_recom = 5, treshold = 0.5 } = request.query;

  const authHeader = request.headers.authorization;

  console.log(authHeader);
  if (!authHeader) {
    return h
      .response({
        status: "false",
        message: "Token tidak ditemukan",
        data: [],
      })
      .code(401);
  }

  let user_id;
  try {
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    user_id = decoded.id;
  } catch (err) {
    return h
      .response({
        status: "false",
        message: "Token tidak valid",
        data: [],
      })
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
      "http://13.236.52.219:8000/recommendation",
      { user_survey: aktifitas },
      { params: { max_recom, treshold } }
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
