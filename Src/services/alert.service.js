import Alert from "../models/alert.model.js";
import { crearNotificacion } from "./notification.service.js";

/**
 * Crea una alerta si no existe una activa reciente del mismo tipo.
 * @param {Object} options
 * @param {String} options.patientId - ID del paciente
 * @param {String} options.doctorId - ID del doctor
 * @param {String} options.type - Tipo de alerta (según enum del modelo)
 * @param {String} options.description - Descripción de la alerta
 * @param {String[]} options.triggeredRules - Códigos de reglas clínicas que la activaron
 * @param {String} [options.severity="media"] - Nivel de severidad: baja, media, alta
 */
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
    const paciente = await Users.findById(patientId).select("username");

    await crearNotificacion({
      recipientId: doctorId,
      title: "Nueva alerta clínica",
      message: `Se generó una alerta para el paciente ${
        paciente?.username || "sin nombre"
      }.`,
      type: "alerta",
    });


    return { created: true, alert: newAlert };
  } catch (error) {
    console.error("[Error] Error al crear alerta:", error);
    throw new Error("Error al crear alerta.");
  }
}

/**
 * Genera múltiples alertas clínicas basadas en las reglas activadas por IA.
 * Agrupa las reglas por tipo de alerta y crea una por cada grupo.
 * @param {String} patientId - ID del paciente
 * @param {String} doctorId - ID del doctor
 * @param {String[]} rulesTriggered - Lista de códigos de reglas activadas (ej. ["ADH01", "ABN02"])
 */
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
