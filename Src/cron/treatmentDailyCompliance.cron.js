import cron from "node-cron";
import Treatment from "../models/treatment.model.js";
import DailyCompliance from "../models/dailyCompliance.model.js";
import { crearNotificacion } from "../services/notification.service.js";

export const startDailyComplianceCron = async () => {
  console.log("[CRON] Iniciando CRON de cumplimiento diario...");

  await runDailyComplianceCheck();

  cron.schedule(
    "5 0 * * *",
    async () => {
      await runDailyComplianceCheck();
    },
    {
      timezone: "America/Lima",
    }
  );
};

const runDailyComplianceCheck = async () => {
  console.log(
    "[CRON] Ejecutando verificación de cumplimiento del día anterior..."
  );

  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  const startOfYesterday = new Date(yesterday.setHours(0, 0, 0, 0));
  const endOfYesterday = new Date(yesterday.setHours(23, 59, 59, 999));

  try {
    const activeTreatments = await Treatment.find({
      status: "Activo",
    }).populate("patient doctor");

    if (activeTreatments.length === 0) {
      console.log("[CRON] No hay tratamientos activos para verificar");
      return;
    }

    for (const treatment of activeTreatments) {
      if (treatment.startDate > endOfYesterday) {
        continue;
      }

      const existingRecord = await DailyCompliance.findOne({
        treatment: treatment._id,
        date: { $gte: startOfYesterday, $lte: endOfYesterday },
      });

      if (existingRecord) continue;

      await DailyCompliance.create({
        treatment: treatment._id,
        patient: treatment.patient._id,
        date: startOfYesterday,
        status: "No Cumplió",
      });

      await crearNotificacion({
        recipientId: treatment.patient._id,
        title: "Incumplimiento de Tratamiento",
        message: "No cumpliste tu tratamiento el día de ayer.",
        type: "info",
      });

      await crearNotificacion({
        recipientId: treatment.doctor._id,
        title: "Paciente no cumplió el tratamiento",
        message: `El paciente ${
          treatment.patient.username || treatment.patient.email
        } no cumplió su tratamiento ayer.`,
        type: "info",
      });

      console.log(
        `[CRON] Se registró incumplimiento para ${treatment.patient._id}`
      );
    }

    console.log("[CRON] Revisión de cumplimiento completada");
  } catch (error) {
    console.error(
      "[CRON] Error en verificación de cumplimiento:",
      error.message
    );
  }
};
