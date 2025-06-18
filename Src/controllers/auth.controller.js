import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { CreateAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { nanoid } from "nanoid";
dotenv.config();
const TOKEN_SECRET = process.env.JWT_SECRET;

export const register = async (req, res, next) => {
  const { username, email, phone, password, registrationToken } = req.body;

  if ("role" in req.body || "doctor" in req.body) {
    return res
      .status(400)
      .json({ message: "No puedes definir manualmente el rol o doctor" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El correo ya está en uso" });
    }

    const userByToken = await User.findOne({ registrationToken });
    if (!userByToken) {
      return res
        .status(400)
        .json({ message: "Token de registro inválido o expirado" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    userByToken.username = username;
    userByToken.email = email;
    userByToken.phone = phone;
    userByToken.password = passwordHash;
    delete userByToken.registrationToken;

    if (userByToken.role === "patient" && userByToken.doctor) {
      await User.findByIdAndUpdate(userByToken.doctor, {
        $addToSet: { assignedPatients: userByToken._id },
      });
    }

    const userSaved = await userByToken.save();
    const token = await CreateAccessToken({
      id: userSaved._id,
      role: userSaved.role,
    });

    res.cookie("token", token);
    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      phone: userSaved.phone,
      role: userSaved.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno al registrar" });
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (!userFound) {
      return res.status(400).json({ message: "Correo no encontrado" });
    }
    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const token = await CreateAccessToken({
      id: userFound._id,
      role: userFound.role,
    });
    res.cookie("token", token);
    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      phone: userFound.phone,
      role: userFound.role,
      token
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno al iniciar sesión" });
    next(error);
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", { expires: new Date(0) });
  return res.sendStatus(200);
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: "No se encontro token" });
  }

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) {
      return res.status(401).json({ message: "No autorizado token invalido" });
    }

    const userFound = await User.findById(user.id);
    if (!userFound) {
      return res.status(401).json({ message: "No autorizado token invalido" });
    }
    return res.json({
      id: userFound.id,
      username: userFound.username,
      email: userFound.email,
      role: userFound.role,
    });
  });
};

export const createRegistrationToken = async (req, res) => {
  const { id: creatorId, role: creatorRole } = req.user;
  const { doctorId } = req.body;

  try {
    const token = nanoid(20);

    if (creatorRole === "doctor") {
      const newUser = new User({
        registrationToken: token,
        role: "patient",
        doctor: creatorId,
      });
      await newUser.save();
      return res.status(201).json({ token });
    }

    if (creatorRole === "admin") {
      let roleToAssign = "doctor";

      const newUser = new User({
        registrationToken: token,
        role: roleToAssign,
      });

      if (doctorId) {
        const doctor = await User.findById(doctorId);
        if (!doctor || doctor.role !== "doctor") {
          return res.status(400).json({ message: "doctorId inválido" });
        }
        newUser.role = "patient";
        newUser.doctor = doctorId;
      }

      await newUser.save();
      return res.status(201).json({ token });
    }

    return res.status(403).json({ message: "No tienes permisos para esto" });
  } catch (error) {
    console.error("[Error] Error al generar token:", error);
    res.status(500).json({ message: "Error al generar el token" });
  }
};
