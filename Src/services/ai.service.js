import ClinicalDetails from "../models/clinicalDetails.model.js";
import Treatment from "../models/treatment.model.js";
import TreatmentHistory from "../models/treatmentHistory.model.js";
import Appointment from "../models/appointment.model.js";
import EducationalHistory from "../models/educationalHistory.model.js";
import ClinicalHistory from "../models/clinicalHistory.model.js";

export const evaluatePatient = async (patientId) => {
  const clinical = await ClinicalDetails.findOne({ patient: patientId });
  const treatment = await Treatment.findOne({ patient: patientId });
  const history = await TreatmentHistory.find({ patient: patientId });
  const appointments = await Appointment.find({ patient: patientId }).sort({
    date: -1,
  });
  const educationHistory = await EducationalHistory.find({ patient: patientId })
    .populate("content")
    .sort({ viewedAt: -1 });

  const clinicalHistory = await ClinicalHistory.find({
    patient: patientId,
  }).sort({
    snapshotDate: -1,
  });

  const now = new Date();
  const recommendations = [];
  const triggeredRules = [];
  let adherenceLevel = "media";
  let dropoutRisk = "bajo";
  let flags = { abandono: false, resistencia: false };

  const daysBetween = (d1, d2) => Math.floor((d1 - d2) / (1000 * 60 * 60 * 24));

  // 1. Adherencia al tratamiento
  const missedAppointments = appointments.filter((a) => {
    return a.status === "no asistió" && daysBetween(now, a.date) <= 30;
  });
  if (missedAppointments.length >= 2) {
    recommendations.push(
      `El paciente ha faltado a ${missedAppointments.length} citas en los últimos 30 días. Se recomienda alertar al doctor y contactar al paciente.`
    );
    triggeredRules.push("ADH01");
    adherenceLevel = "baja";
  }

  const interruptions = history
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .map((item, i, arr) => {
      if (i === 0) return 0;
      return daysBetween(
        new Date(item.timestamp),
        new Date(arr[i - 1].timestamp)
      );
    })
    .filter((gap) => gap >= 3);
  if (interruptions.length > 0) {
    recommendations.push(
      `Se detectaron ${interruptions.length} interrupciones del tratamiento de al menos 3 días. Reforzar seguimiento y monitoreo domiciliario.`
    );
    triggeredRules.push("ADH02");
  }

  const daysSinceLastClinicalUpdate = clinical?.updatedAt
    ? daysBetween(now, new Date(clinical.updatedAt))
    : 999;
  if (daysSinceLastClinicalUpdate >= 14) {
    recommendations.push(
      `No se ha actualizado el historial clínico en los últimos ${daysSinceLastClinicalUpdate} días. Contactar al paciente o revisar seguimiento.`
    );
    triggeredRules.push("ADH03");
  }

  // 2. Riesgo de abandono
  if (missedAppointments.length >= 2 && interruptions.some((i) => i >= 5)) {
    recommendations.push(
      `Combinación de ${missedAppointments.length} ausencias y al menos una interrupción ≥ 5 días. Evaluación psicosocial inmediata recomendada.`
    );
    triggeredRules.push("ABN01");
    dropoutRisk = "alto";
    flags.abandono = true;
  }

  if (clinicalHistory.length > 1) {
    const latestSnapshot = clinicalHistory[0];
    const previousSnapshot = clinicalHistory[1];

    const weightLoss =
      previousSnapshot.weight &&
      latestSnapshot.weight <= previousSnapshot.weight * 0.95;

    if (weightLoss && latestSnapshot.clinicalNotes?.includes("decaimiento")) {
      recommendations.push(
        `Pérdida de >5% de peso desde el último control (${previousSnapshot.weight}kg → ${latestSnapshot.weight}kg) junto a decaimiento. Se sugiere apoyo emocional y visita domiciliaria.`
      );
      triggeredRules.push("ABN02");
    }
  } else if (clinicalHistory.length === 1 && clinical?.weight) {
    const previousSnapshot = clinicalHistory[0];

    const weightLoss =
      previousSnapshot.weight &&
      clinical.weight <= previousSnapshot.weight * 0.95;

    if (weightLoss && clinical.clinicalNotes?.includes("decaimiento")) {
      recommendations.push(
        `Pérdida de >5% de peso desde el último control (${previousSnapshot.weight}kg → ${clinical.weight}kg) junto a decaimiento. Se sugiere apoyo emocional y visita domiciliaria.`
      );
      triggeredRules.push("ABN02");
    }
  }

  if (clinical?.clinicalNotes?.match(/abandona|no cree/i)) {
    recommendations.push(
      "Comentarios que indican intención de abandonar el tratamiento. Activar protocolo de consejería motivacional."
    );
    triggeredRules.push("ABN03");
  }

  // 3. Tratamiento inefectivo
  const symptomsNow = clinical?.symptoms || [];
  const pastSnapshots = history.filter(
    (h) => h.treatmentSnapshot?.notes || h.treatmentSnapshot?.symptoms
  );
  const noImprovement = pastSnapshots.some((s) => {
    return symptomsNow.some((symptom) =>
      s.treatmentSnapshot.notes?.includes(symptom)
    );
  });
  const weeksSinceStart = treatment?.startDate
    ? daysBetween(now, new Date(treatment.startDate)) / 7
    : 0;

  if (weeksSinceStart >= 4 && noImprovement) {
    recommendations.push(
      "No se observa mejoría clínica tras 4 semanas de tratamiento. Reevaluar tratamiento actual."
    );
    triggeredRules.push("TRF01");
  }
  if (
    weeksSinceStart >= 4 &&
    clinical?.weight &&
    clinical?.weight <= pastSnapshots.at(-1)?.treatmentSnapshot?.weight
  ) {
    recommendations.push(
      "Peso estable o en descenso después de 4 semanas. Realizar evaluación nutricional."
    );
    triggeredRules.push("TRF02");
  }
  if (pastSnapshots.length >= 2) {
    const latest = pastSnapshots.at(-1).treatmentSnapshot?.symptoms || [];
    const previous = pastSnapshots.at(-2).treatmentSnapshot?.symptoms || [];
    if (
      previous.length &&
      latest.length &&
      latest.some((s) => previous.includes(s))
    ) {
      recommendations.push(
        "Reaparición de síntomas antes de los 60 días. Evaluar posible recaída."
      );
      triggeredRules.push("TRF03");
    }
  }

  // 4. Posible resistencia a medicamentos
  if (weeksSinceStart >= 6 && symptomsNow.includes("fiebre")) {
    recommendations.push(
      "Presencia de síntomas (como fiebre) después de 6 semanas. Solicitar prueba de sensibilidad."
    );
    triggeredRules.push("RST01");
    flags.resistencia = true;
  }
  const treatmentChanges = history.filter((h) => h.action === "update").length;
  if (treatmentChanges >= 2) {
    recommendations.push(
      `Se han realizado ${treatmentChanges} cambios de tratamiento sin mejoría. Evaluar TBC multirresistente.`
    );
    triggeredRules.push("RST02");
    flags.resistencia = true;
  }
  if (treatmentChanges >= 1 && noImprovement) {
    recommendations.push(
      "Empeoramiento del paciente tras cambio a segunda línea. Referir de urgencia."
    );
    triggeredRules.push("RST03");
    flags.resistencia = true;
  }

  // 5. Reglas educativas
  const lastEducation = educationHistory[0];
  const daysSinceLastEducation = lastEducation
    ? daysBetween(now, new Date(lastEducation.viewedAt))
    : 999;

  if (daysSinceLastEducation >= 60) {
    recommendations.push(
      `No se ha accedido a contenido educativo en los últimos ${daysSinceLastEducation} días. Reforzar estrategia enviando material relevante.`
    );
    triggeredRules.push("EDU01");
  }

  if (adherenceLevel === "baja" && educationHistory.length === 0) {
    recommendations.push(
      "Paciente con baja adherencia y sin historial educativo. Priorizar material digital antes de escalar."
    );
    triggeredRules.push("EDU02");
  }

  const adherenceRelatedViews = educationHistory.filter(
    (h) =>
      h.content?.clinicalTags?.includes("adh_baja") ||
      h.content?.clinicalTags?.includes("abandono_probable") ||
      h.content?.clinicalTags?.includes("riesgo_abandono_alto")
  );
  if (adherenceLevel === "baja" && adherenceRelatedViews.length >= 3) {
    recommendations.push(
      "Paciente recibió ≥3 contenidos sobre adherencia/abandono pero sigue con baja adherencia. Escalar a intervención psicosocial."
    );
    triggeredRules.push("EDU03");
  }

  if (lastEducation) {
    const lastEducationDate = new Date(lastEducation.viewedAt);

    const missedBeforeEducation = appointments.filter(
      (a) => a.status === "no asistió" && a.date < lastEducationDate
    ).length;

    const missedAfterEducation = appointments.filter(
      (a) => a.status === "no asistió" && a.date >= lastEducationDate
    ).length;

    if (
      missedBeforeEducation > missedAfterEducation &&
      adherenceLevel !== "baja"
    ) {
      recommendations.push(
        "Tras acceder a contenido educativo, el paciente mejoró asistencia y continuidad del tratamiento. Reforzar con materiales similares."
      );
      triggeredRules.push("EDU04");
    }
  }

  // 6. Reglas complementarias
  const lastAppointment = appointments[0];
  if (lastAppointment && daysBetween(now, lastAppointment.date) > 30) {
    recommendations.push(
      `La última cita fue hace más de ${daysBetween(
        now,
        lastAppointment.date
      )} días. Marcar al paciente como inactivo y programar revisión.`
    );
    triggeredRules.push("CMP01");
  }
  if (!appointments.length && !treatment && !clinical) {
    recommendations.push(
      "No hay citas, historial ni tratamiento registrado en los últimos 45 días. Escalar a intervención social."
    );
    triggeredRules.push("CMP02");
    dropoutRisk = "alto";
    flags.abandono = true;
  }

  return {
    adherenceLevel,
    dropoutRisk,
    flags,
    recommendations,
    triggeredRules,
    educationStats: {
      totalViewed: educationHistory.length,
      lastViewedAt: lastEducation?.viewedAt || null,
    },
  };
};
