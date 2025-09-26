import { getIO } from "../sockets/socket.js";

const validateInputs = (userId, data) => {
  if (!userId) {
    throw new Error("userId es requerido");
  }
  if (!data) {
    throw new Error("data es requerido");
  }
};

export const sendNotification = (userId, data) => {
  try {
    validateInputs(userId, data);
    const io = getIO();
    io.to(userId.toString()).emit("server:notification", data);
    console.log(`[Socket] Notificación enviada a ${userId}`);
  } catch (error) {
    console.error("[Socket] Error al enviar notificación:", error);
  }
};

export const sendAlert = (userId, data) => {
  try {
    validateInputs(userId, data);
    const io = getIO();
    io.to(userId.toString()).emit("server:alert", data);
    console.log(`[Socket] Alerta enviada a ${userId}`);
  } catch (error) {
    console.error("[Socket] Error al enviar alerta:", error);
  }
};
