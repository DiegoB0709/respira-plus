import cron from "node-cron";
import Users from "../models/user.model.js";
import { evaluatePatient } from "../services/ai.service.js";
import { createAlertsFromAI } from "../services/alert.service.js";

const revisarPacientes = async () => {
  const patients = await Users.find({ role: "patient", isActive: true });

  for (const patient of patients) {
    const doctorId = patient.doctor;
    if (!doctorId) continue;

    const result = await evaluatePatient(patient._id);

    if (result.recommendations.length > 0) {
      await createAlertsFromAI(
        patient._id,
        doctorId,
        result.recommendations.map((r) => r.slice(0, 5))
      );
    }
  }
};

export const startAlertChecker = async () => {
  console.log(
    "[CRON] Ejecutando revisión inicial de pacientes al arrancar el servidor..."
  );

  try {
    await revisarPacientes();
    console.log("[CRON] Revisión inicial de pacientes completada.");
  } catch (error) {
    console.error("[CRON] Error en la revisión inicial:", error);
  }

  cron.schedule("0 */12 * * *", async () => {
    console.log("[CRON] Iniciando revisión automática de pacientes...");

    try {
      await revisarPacientes();
      console.log("[CRON] Revisión completa. Alertas clínicas actualizadas.");
    } catch (error) {
      console.error("[CRON] Error durante la revisión automática:", error);
    }
  });
};
