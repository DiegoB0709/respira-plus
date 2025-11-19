import cron from "node-cron";
import mongoose from "mongoose";
import Treatment from "../models/treatment.model.js";
import { crearNotificacion } from "../services/notification.service.js";

const SERVER_USER_ID = new mongoose.Types.ObjectId(process.env.SERVER_USER_ID);

export const startTreatmentCron = async () => {
  console.log("[CRON] Iniciando CRON de verificación de tratamientos...");

  await runTreatmentCheck();

  cron.schedule("0 0 * * *", async () => {
    await runTreatmentCheck();
  });
};

const runTreatmentCheck = async () => {
  console.log(
    "[CRON] Ejecutando verificación de tratamientos vencidos y actualización de estado..."
  );
  const now = new Date();

  try {
    const treatmentsToExpire = await Treatment.find({
      status: "Activo",
      endDate: { $lte: now },
    }).populate("patient doctor");

    if (treatmentsToExpire.length === 0) {
      console.log("[CRON] No se encontraron tratamientos activos vencidos");
      return;
    }

    for (const treatment of treatmentsToExpire) {
      await Treatment.findOneAndUpdate(
        { _id: treatment._id },
        { $set: { status: "Finalizado", updatedAt: new Date() } }
      );

      await crearNotificacion({
        recipientId: treatment.patient._id,
        title: "Tratamiento Finalizado",
        message: "Tu tratamiento ha finalizado automáticamente por fecha.",
        type: "info",
        actionBy: SERVER_USER_ID,
      });

      await crearNotificacion({
        recipientId: treatment.doctor._id,
        title: "Tratamiento Finalizado: Pendiente de Observación",
        message: `El tratamiento del paciente ${
          treatment.patient.username || treatment.patient.email
        } ha finalizado automáticamente y requiere que ingrese las observaciones finales.`,
        type: "info",
        actionBy: SERVER_USER_ID,
      });

      console.log(
        `[CRON] Tratamiento finalizado para paciente ${treatment.patient._id}. Notificado a paciente y doctor.`
      );
    }

    console.log(
      `[CRON] Finalización de tratamientos completada. Procesados: ${treatmentsToExpire.length}`
    );
  } catch (error) {
    console.error(
      "[CRON] Error al procesar tratamientos vencidos:",
      error.message
    );
  }
};
