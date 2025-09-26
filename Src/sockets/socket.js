import jwt from "jsonwebtoken";
import { Server } from "socket.io";

let io;

export const initSocketServer = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token || typeof token !== "string") {
        return next(new Error("Token no válido o no proporcionado"));
      }

      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return next(new Error("Token inválido o expirado"));
        }

        if (!decoded?.id) {
          return next(new Error("Token mal formado"));
        }

        socket.userId = decoded.id.toString();
        next();
      });
    } catch (error) {
      next(new Error("Error en autenticación"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.userId;

    if (!userId) {
      socket.disconnect();
      return;
    }

    socket.join(userId);
    console.log(`[SOCKET] Usuario conectado: ${userId}`);

    socket.on("disconnect", (reason) => {
      console.log(`[SOCKET] Usuario desconectado: ${userId}. Razón: ${reason}`);
    });

    socket.on("error", (error) => {
      console.error(`[SOCKET] Error para usuario ${userId}:`, error);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    const error = "[ERROR] Socket.IO no está inicializado";
    console.error(error);
    throw new Error(error);
  }
  return io;
};
