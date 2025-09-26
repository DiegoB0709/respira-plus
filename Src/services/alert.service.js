import Alert from "../models/alert.model.js";
import { sendAlert } from "./socketEvents.service.js";

export async function createAlertIfNotExists({
  patientId,
  doctorId,
  type,
  description,
  triggeredRules,
  severity = "media",
}) {
  try {
    const existing = await Alert.findOne({
      patient: patientId,
      type,
      status: "activa",
    });

    if (existing) {
      return {
        created: false,
        reason: "Ya existe alerta activa de este tipo.",
      };
    }

    const newAlert = new Alert({
      patient: patientId,
      doctor: doctorId,
      type,
      description,
      triggeredRules,
      severity,
    });

    await newAlert.save();

    if (doctorId) {
      sendAlert(doctorId, {
        id: newAlert._id,
        type,
        description,
        severity,
        createdAt: newAlert.createdAt,
      });
    }

    return { created: true, alert: newAlert };
  } catch (error) {
    console.error("[Error] Error al crear alerta:", error);
    throw new Error("Error al crear alerta.");
  }
}

export async function createAlertsFromAI(
  patientId,
  doctorId,
  rulesTriggered = []
) {
  if (!rulesTriggered || rulesTriggered.length === 0) return;

  const alertTypesMap = {
    baja_adherencia: ["ADH01", "ADH02", "ADH03"],
    riesgo_abandono: ["ABN01", "ABN02", "ABN03"],
    tratamiento_inefectivo: ["TRF01", "TRF02", "TRF03"],
    resistencia_medicamentosa: ["RST01", "RST02", "RST03"],
    falta_educacion: ["EDU01", "EDU02", "EDU03", "EDU04"],
    inactividad_prolongada: ["CMP01", "CMP02"],
  };

  const groupedAlerts = {};

  for (const rule of rulesTriggered) {
    for (const [type, ruleCodes] of Object.entries(alertTypesMap)) {
      if (ruleCodes.includes(rule)) {
        if (!groupedAlerts[type]) groupedAlerts[type] = [];
        groupedAlerts[type].push(rule);
      }
    }
  }

  for (const [type, rules] of Object.entries(groupedAlerts)) {
    let description = "";

    switch (type) {
      case "baja_adherencia":
        description =
          "El paciente presenta signos de baja adherencia al tratamiento.";
        break;
      case "riesgo_abandono":
        description =
          "Se detecta un posible riesgo de abandono del tratamiento.";
        break;
      case "tratamiento_inefectivo":
        description =
          "El tratamiento actual podría no estar generando los resultados esperados.";
        break;
      case "resistencia_medicamentosa":
        description = "Se sospecha posible resistencia a los medicamentos.";
        break;
      case "falta_educacion":
        description =
          "Se identificaron patrones relacionados con falta o baja efectividad de la educación al paciente.";
        break;
      case "inactividad_prolongada":
        description =
          "El paciente presenta inactividad prolongada en el sistema.";
        break;
      default:
        description = "Se detectaron patrones clínicos inusuales.";
    }

    await createAlertIfNotExists({
      patientId,
      doctorId,
      type,
      description,
      triggeredRules: rules,
      severity: rules.length >= 2 ? "alta" : "media",
    });
  }
}
