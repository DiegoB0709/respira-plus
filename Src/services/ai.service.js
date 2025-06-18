import ClinicalDetails from "../models/clinicalDetails.model.js";
import Treatment from "../models/treatment.model.js";
import TreatmentHistory from "../models/treatmentHistory.model.js";
import Appointment from "../models/appointment.model.js";

export const evaluatePatient = async (patientId) => {
  const clinical = await ClinicalDetails.findOne({ patient: patientId });
  const treatment = await Treatment.findOne({ patient: patientId });
  const history = await TreatmentHistory.find({ patient: patientId });
  const appointments = await Appointment.find({ patient: patientId }).sort({
    date: -1,
  });

  const now = new Date();
  const recommendations = [];
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
      `ADH01: El paciente ha faltado a ${missedAppointments.length} citas en los últimos 30 días. Se recomienda alertar al doctor y contactar al paciente.`
    );
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
      `ADH02: Se detectaron ${interruptions.length} interrupciones del tratamiento de al menos 3 días. Reforzar seguimiento y monitoreo domiciliario.`
    );
  }

  const daysSinceLastClinicalUpdate = clinical?.updatedAt
    ? daysBetween(now, new Date(clinical.updatedAt))
    : 999;
  if (daysSinceLastClinicalUpdate >= 14) {
    recommendations.push(
      `ADH03: No se ha actualizado el historial clínico en los últimos ${daysSinceLastClinicalUpdate} días. Contactar al paciente o revisar seguimiento.`
    );
  }

  // 2. Riesgo de abandono
  if (missedAppointments.length >= 2 && interruptions.some((i) => i >= 5)) {
    recommendations.push(
      `ABN01: Combinación de ${missedAppointments.length} ausencias y al menos una interrupción ≥ 5 días. Evaluación psicosocial inmediata recomendada.`
    );
    dropoutRisk = "alto";
    flags.abandono = true;
  }

  if (clinical?.weight && clinical?.bmi) {
    const weightLoss = clinical.weight < 0.95 * clinical.weight;
    if (weightLoss && clinical.clinicalNotes?.includes("decaimiento")) {
      recommendations.push(
        "ABN02: Pérdida significativa de peso junto a decaimiento. Se sugiere apoyo emocional y visita domiciliaria."
      );
    }
  }

  if (clinical?.clinicalNotes?.match(/abandona|no cree/i)) {
    recommendations.push(
      "ABN03: Comentarios que indican intención de abandonar el tratamiento. Activar protocolo de consejería motivacional."
    );
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
      "TRF01: No se observa mejoría clínica tras 4 semanas de tratamiento. Reevaluar tratamiento actual."
    );
  }
  if (
    weeksSinceStart >= 4 &&
    clinical?.weight &&
    clinical?.weight <= pastSnapshots.at(-1)?.treatmentSnapshot?.weight
  ) {
    recommendations.push(
      "TRF02: Peso estable o en descenso después de 4 semanas. Realizar evaluación nutricional."
    );
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
        "TRF03: Reaparición de síntomas antes de los 60 días. Evaluar posible recaída."
      );
    }
  }

  // 4. Posible resistencia a medicamentos
  if (weeksSinceStart >= 6 && symptomsNow.includes("fiebre")) {
    recommendations.push(
      "RST01: Presencia de síntomas (como fiebre) después de 6 semanas. Solicitar prueba de sensibilidad."
    );
    flags.resistencia = true;
  }
  const treatmentChanges = history.filter((h) => h.action === "update").length;
  if (treatmentChanges >= 2) {
    recommendations.push(
      `RST02: Se han realizado ${treatmentChanges} cambios de tratamiento sin mejoría. Evaluar TBC multirresistente.`
    );
    flags.resistencia = true;
  }
  if (treatmentChanges >= 1 && noImprovement) {
    recommendations.push(
      "RST03: Empeoramiento del paciente tras cambio a segunda línea. Referir de urgencia."
    );
    flags.resistencia = true;
  }

  // 5. Reglas complementarias
  const lastAppointment = appointments[0];
  if (lastAppointment && daysBetween(now, lastAppointment.date) > 30) {
    recommendations.push(
      `CMP01: La última cita fue hace más de ${daysBetween(
        now,
        lastAppointment.date
      )} días. Marcar al paciente como inactivo y programar revisión.`
    );
  }
  if (!appointments.length && !treatment && !clinical) {
    recommendations.push(
      "CMP02: No hay citas, historial ni tratamiento registrado en los últimos 45 días. Escalar a intervención social."
    );
    dropoutRisk = "alto";
    flags.abandono = true;
  }

  return {
    adherenceLevel,
    dropoutRisk,
    flags,
    recommendations,
  };
};
