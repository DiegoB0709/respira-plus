import cron from "node-cron";
import { sendPendingNotifications } from "../services/sendPendingNotifications.service.js";
import { transporterReady } from "../libs/mailer.js";

export const startEmailNotifier = async () => {
  console.log(
    "[CRON] Ejecutando envío de notificaciones por correo al iniciar el servidor..."
  );
  try {
    await transporterReady;
    await sendPendingNotifications();
  } catch (error) {
    console.error(
      "[MAIL] Error inicial al enviar notificaciones:",
      error.message
    );
  }

  cron.schedule("*/15 * * * *", async () => {
    console.log("[CRON] Ejecutando CRON de notificaciones por correo...");
    try {
      await transporterReady;
      await sendPendingNotifications();
    } catch (error) {
      console.error("[MAIL] Error en CRON de notificaciones:", error.message);
    }
  });
};
