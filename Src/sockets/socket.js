import jwt from "jsonwebtoken";
import { Server } from "socket.io";

let io;
const connectedUsers = new Map();

export const initSocketServer = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Token no proporcionado"));

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return next(new Error("Token inválido"));

      socket.userId = decoded.id;
      next();
    });
  });

  io.on("connection", (socket) => {
    const userId = socket.userId;

    connectedUsers.set(userId, socket.id);
    console.log(`[Socket] Usuario conectado: ${userId}`);

    socket.on("disconnect", () => {
      connectedUsers.delete(userId);
      console.log(`[Socket] Usuario desconectado: ${userId}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("[Error] Socket.IO no está inicializado");
  return io;
};

export const getSocketIdByUserId = (userId) => connectedUsers.get(userId);
