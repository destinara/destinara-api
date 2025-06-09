import { prisma } from "../models/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// const prisma = new PrismaClient();

// ======================
// ✅ REGISTER HANDLER
// ======================
export const RegisterHandler = async (request, h) => {
  try {
    const { name, email, gender, password } = request.payload;

    if (!name || !email || !gender || !password) {
      return h
        .response({
          status: "error",
          message: "Semua field harus diisi",
        })
        .code(400);
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.users.findFirst({ where: { email } });
    if (existingUser) {
      return h
        .response({
          status: "error",
          message: "Email sudah digunakan",
        })
        .code(409);
    }

    // Hash password
    const passwordHashed = await bcrypt.hash(password, 10);

    // Buat user baru
    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        gender,
        password: passwordHashed,
        created_at: new Date(),
      },
    });

    // Buat token
    const token = jwt.sign(
      { email: newUser.email, id: newUser.id },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    return h
      .response({
        status: "success",
        message: "Berhasil registrasi",
        data: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          gender: newUser.gender,
        },
        token,
      })
      .code(201);
  } catch (error) {
    console.error(error);
    return h
      .response({
        status: "error",
        message: "Gagal registrasi",
        data: error,
      })
      .code(500);
  }
};

// ======================
// ✅ LOGIN HANDLER
// ======================
export const LoginHandler = async (request, h) => {
  try {
    const { email, password } = request.payload;

    if (!email || !password) {
      return h
        .response({
          status: "error",
          message: "Email dan password harus diisi",
        })
        .code(400);
    }

    const user = await prisma.users.findFirst({ where: { email } });

    if (!user) {
      return h
        .response({
          status: "error",
          message: "Email tidak ditemukan",
        })
        .code(404);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return h
        .response({
          status: "error",
          message: "Password salah",
        })
        .code(401);
    }

    const token = jwt.sign(
      { email: user.email, id: user.id },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    return h
      .response({
        status: "success",
        message: "Berhasil login",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          gender: user.gender,
        },
        token,
      })
      .code(200);
  } catch (error) {
    console.error(error);
    return h
      .response({
        status: "error",
        message: "Gagal login",
        data: error,
      })
      .code(500);
  }
};

// ======================
// ✅ LOGOUT HANDLER
// ======================
export const LogoutHandler = async (request, h) => {
  try {
    // Misalnya logout hanya menghapus token dari sisi klien
    return h
      .response({
        status: "success",
        message: "Berhasil logout. Silakan hapus token dari sisi klien.",
      })
      .code(200);

    // OPTIONAL: Jika kamu menyimpan token ke blacklist, bisa tambahkan logika di sini
    // const token = request.headers.authorization?.split(' ')[1];
    // Tambahkan token ke Redis atau database sebagai blacklist
  } catch (error) {
    console.error(error);
    return h
      .response({
        status: "error",
        message: "Gagal logout",
        data: error,
      })
      .code(500);
  }
};
