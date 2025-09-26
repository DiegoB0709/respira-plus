import Notification from "../models/notification.model.js";
import { sendNotification } from "./socketEvents.service.js";

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

    sendNotification(recipientId, {
      id: saved._id,
      title,
      message,
      type,
      createdAt: saved.createdAt,
    });

    return saved;
  } catch (error) {
    console.error("[Error] Error al crear notificación:", error);
    throw new Error("No se pudo crear la notificación");
  }
};
