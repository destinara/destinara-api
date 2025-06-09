import { prisma } from "../models/prisma.js";
import * as tf from "@tensorflow/tfjs";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";

// export const CobaTest = async (request, h) => {
//   const authHeader = request.headers.authorization;

//   // Biasanya tokennya format: "Bearer <token>"
//   const token = authHeader.split(" ")[1]; // ambil token setelah "Bearer

//   console.log(token);

//   try {
//     // Verifikasi token dengan SECRET_KEY dari env atau config

//     const payload = jwt.verify(token, process.env.SECRET_KEY);

//     // Ambil user_id dari payload
//     const userId = payload.id;

//     console.log("User Id", userId);

//     return h
//       .response({
//         status: "success",
//         message: "Berhasil",
//         data: {
//           user_id: userId,
//         },
//       })
//       .code(200);
//   } catch (error) {
//     return h.response({ error: "Invalid token" }).code(401);
//   }
// };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const CreateSurvey = async (request, h) => {
  const { survey } = request.payload;

  const authHeader = request.headers.authorization;

  // Biasanya tokennya format: "Bearer <token>"
  const token = authHeader.split(" ")[1]; // ambil token setelah "Bearer

  const { id } = jwt.decode(token, process.env.SECRET_KEY);

  if (!id || !survey) {
    return h
      .response({
        status: "error",
        message: "Authorization Header `id` dan body `survey` wajib diisi",
      })
      .code(400);
  }

  // D:\Kuliah\CODE CAMP DBS\Capstone\destinara-api\model\vocab_destinasi.json
  // 'D:\Kuliah\CODE CAMP DBS\Capstone\destinara-api\model\vocab_destination.json'

  const userId = parseInt(id);

  // Akses file model dari folder "model" di root
  const modelPath = path.join(__dirname, "../../model/model.json");
  const vocabUserPath = path.join(__dirname, "../../model/vocab_user.json");
  const vocabDestPath = path.join(
    __dirname,
    "../../model/vocab_destinasi.json"
  );

  try {
    // Load vocabularies
    const vocabUser = JSON.parse(await fs.readFile(vocabUserPath, "utf-8"));
    const vocabDest = JSON.parse(await fs.readFile(vocabDestPath, "utf-8"));

    // Tokenizer function
    const tokenize = (text, vocab) => {
      return text
        .toLowerCase()
        .split(/\W+/)
        .map((word) => vocab[word] || 0);
    };

    // List destinasi
    const destinasiList = [
      "Tujuan Wisata",
      "Monumen",
      "Pantai",
      "Toko Suvenir",
      "Taman bermain",
      "Patung",
      "Toko Pie",
      "Bangunan Bersejarah",
      "Taman Rekreasi Air",
      "Toko Roti",
      "Titik Pemandangan",
      "Taman Hiburan",
      "Benteng",
      "Museum Sejarah",
      "Taman",
      "Pembuat monumen",
      "Arena Bermain Anak-Anak",
      "Puncak Gunung",
      "Bangunan Terkenal",
      "Museum",
      "Kebun Binatang",
      "Area Mendaki",
      "Pusat Perbelanjaan",
      "Pusat Rekreasi",
      "Museum arkeologi",
      "Gunung berapi",
      "Wahana Taman Hiburan",
      "Taman Bermain Dalam Ruangan",
      "Taman Peringatan",
      "Bumi perkemahan",
      "Area Rekreasi Alam",
      "Taman Kota",
      "Pusat Hiburan",
      "Peternakan",
      "Pusat Hiburan Anak-Anak",
      "Taman Komunitas",
      "Museum Ilmu Pengetahuan Alam",
      "Promenade",
      "Pantai Umum",
      "Taman Margasatwa dan Safari",
      "Hutan Nasional",
      "Taman Ekologi",
      "Museum Seni",
      "Toko Kue",
      "Cagar Alam",
      "Museum Rel Kereta",
      "Semenanjung",
      "Museum Bahari",
      "Tempat bermain gokart",
      "Arsip Negara",
      "Museum Angkatan Bersenjata",
      "Museum Patung",
      "Museum tempat bersejarah",
      "Museum Sejarah Lokal",
      "Lahan Piknik",
      "Kebun Raya",
      "Situs purbakala",
      "Museum Hewan",
      "Tempat Bersejarah",
      "Taman Nasional",
      "Perlindungan Margasatwa",
      "Akuarium",
      "Perpustakaan",
      "Museum Seni Modern",
      "Wahana Bermain Salju Dalam Ruangan",
      "Pusat kebudayaan",
      "Museum Pusaka",
      "Universitas Negeri",
      "Galeri Seni",
      "Museum Nasional",
      "Warung Camilan",
      "Complex volcano",
      "Kastel",
      "Museum Sains",
      "Rumah Berhantu",
      "Peternakan wisata",
      "Teater Seni Pertunjukan",
      "Pelestarian Situs Peninggalan",
      "Klub Pecinta Sejarah",
      "Taman karavan",
      "Taman bermain papan seluncur",
    ];

    // Tokenisasi
    const userTokens = destinasiList.map(() => tokenize(survey, vocabUser));
    const destTokens = destinasiList.map((dest) => tokenize(dest, vocabDest));

    // Padding
    const padSequence = (seq, maxLen = 20) => {
      const padded = Array(maxLen).fill(0);
      for (let i = 0; i < Math.min(seq.length, maxLen); i++) {
        padded[i] = seq[i];
      }
      return padded;
    };

    const userInput = tf.tensor2d(userTokens.map((seq) => padSequence(seq)));
    const destInput = tf.tensor2d(destTokens.map((seq) => padSequence(seq)));

    // Load model
    // const model = await tf.loadLayersModel(`file://${modelPath}`);
    const model = await tf.loadLayersModel(
      `https://raw.githubusercontent.com/destinara/destinara-api/main/model/model.json`
    );

    // Prediksi
    // const predictions = model.predict({
    //   user_preferensi: userInput,
    //   tipe_destinasi: destInput,
    // });

    const predictions = model.predict([userInput, destInput]);

    const scores = await predictions.array();

    // Simpan ke DB
    for (let i = 0; i < destinasiList.length; i++) {
      await prisma.rekomendasi_destinasi.create({
        data: {
          user_id: userId,
          kategori: destinasiList[i],
          score: Math.round(scores[i][0] * 100),
          created_at: new Date(),
        },
      });
    }

    return h.response({
      status: "success",
      message: "Rekomendasi berhasil dibuat",
      rekomendasi: destinasiList.map((dest, i) => ({
        kategori: dest,
        skor: scores[i][0],
      })),
    });
  } catch (error) {
    console.error(error);
    return h
      .response({
        status: "error",
        message: "Gagal membuat rekomendasi",
        data: error,
      })
      .code(500);
  }

  //todo : load model

  //*hasil load model simpan ke database
  //todo : create rekomendasi
  // const rekomendasi = await prisma.rekomendasi_destinasi.create({
  //   data: {
  //     user_id: userId,
  //     kategori: "",
  //     score: 0,
  //     created_at: new Date(),
  //   },
  // });
};
