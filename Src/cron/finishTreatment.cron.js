import cron from "node-cron";
import mongoose from "mongoose";
import Treatment from "../models/treatment.model.js";
import TreatmentHistory from "../models/treatmentHistory.model.js";
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
  console.log("[CRON] Ejecutando verificación de tratamientos vencidos...");
  const now = new Date();

  try {
    const expiredTreatments = await Treatment.find({
      endDate: { $lte: now },
    }).populate("patient doctor");

    if (expiredTreatments.length === 0) {
      console.log("[CRON] No se encontraron tratamientos vencidos");
      return;
    }

    for (const treatment of expiredTreatments) {
      await TreatmentHistory.create({
        action: "finished",
        patient: treatment.patient._id,
        doctor: treatment.doctor._id,
        treatment: treatment._id,
        treatmentSnapshot: {
          startDate: treatment.startDate,
          endDate: treatment.endDate,
          medications: treatment.medications,
          notes: treatment.notes,
        },
        actionBy: SERVER_USER_ID,
      });

      await crearNotificacion({
        recipientId: treatment.patient._id,
        title: "Tratamiento Finalizado",
        message: "Tu tratamiento anterior finalizó.",
        type: "info",
      });

      await Treatment.deleteOne({ _id: treatment._id });

      console.log(
        `[CRON] Tratamiento finalizado para paciente ${treatment.patient._id}`
      );
    }

    console.log(
      `[CRON] Finalización de tratamientos completada. Procesados: ${expiredTreatments.length}`
    );
  } catch (error) {
    console.error(
      "[CRON] Error al procesar tratamientos vencidos:",
      error.message
    );
  }
};
