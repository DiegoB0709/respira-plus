import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import http from "http";
import { connectDB } from "./db.js";
import { transporterReady } from "./libs/mailer.js";
import { initSocketServer } from "./sockets/socket.js";
import { startAlertChecker } from "./cron/alertChecker.cron.js";
import { startEmailNotifier } from "./cron/emailNotifications.cron.js";
import { startUpdateAppointmentsCron } from "./cron/updateAppointments.cron.js";
import { startTreatmentCron } from "./cron/finishTreatment.cron.js";
import { startDailyComplianceCron } from "./cron/treatmentDailyCompliance.cron.js";

const port = process.env.PORT;

const main = async () => {
  try {
    console.log("[INIT] Inicio del proceso de arranque del servidor...");

    await connectDB();

    const server = http.createServer(app);
    initSocketServer(server);
    server.listen(port, () => {
      console.log(
        `[SERVER] Servidor HTTP y WebSocket están activos en el puerto ${port}`
      );
    });

    await transporterReady;

    await startAlertChecker();
    await startEmailNotifier();
    await startUpdateAppointmentsCron();
    await startTreatmentCron();
    await startDailyComplianceCron();

    console.log("[INIT] Proceso de inicialización completado con éxito.");
  } catch (error) {
    console.error("[INIT] Error durante inicialización:", error);
    process.exit(1);
  }
};

main();
