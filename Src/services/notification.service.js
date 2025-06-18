import Notification from "../models/notification.model.js";
import { getIO, getSocketIdByUserId } from "../sockets/socket.js";

export const crearNotificacion = async ({
  recipientId,
  title,
  message,
  type,
}) => {
  try {
    const nuevaNotificacion = new Notification({
      recipient: recipientId,
      title,
      message,
      type,
    });

    const saved = await nuevaNotificacion.save();

    const socketId = getSocketIdByUserId(String(recipientId));
    if (socketId) {
      const io = getIO();
      io.to(socketId).emit("nuevaNotificacion", {
        _id: saved._id,
        title: saved.title,
        message: saved.message,
        type: saved.type,
        createdAt: saved.createdAt,
        read: saved.read,
      });
    }

    return saved;

  } catch (error) {
    console.error("[Error] Error al crear notificación:", error);
    throw new Error("No se pudo crear la notificación");
  }
};
