import { evaluatePatient } from "../services/ai.service.js";
import { createAlertsFromAI } from "../services/alert.service.js";
import Users from "../models/user.model.js";

export const evaluatePatientController = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { patientId } = req.params;

    if (req.user.role !== "doctor") {
      return res.status(403).json({
        message: "Acceso denegado: solo doctores pueden realizar evaluaciones.",
      });
    }

    const doctor = await Users.findById(doctorId);
    if (!doctor || !doctor.assignedPatients) {
      return res.status(403).json({
        message: "Doctor no encontrado o no tiene pacientes asignados.",
      });
    }

    const patient = await Users.findOne({
      _id: patientId,
      role: "patient",
    });
    if (!patient) {
      return res.status(404).json({ message: "Paciente no encontrado." });
    }

    const isAssigned = doctor.assignedPatients
      .map((id) => id.toString())
      .includes(patientId);
    if (!isAssigned) {
      return res.status(403).json({
        message: "Paciente no asignado a este doctor.",
      });
    }

    const evaluation = await evaluatePatient(patientId);

    await createAlertsFromAI(patientId, doctorId, evaluation.triggeredRules);

    if (
      !evaluation.recommendations ||
      evaluation.recommendations.length === 0
    ) {
      evaluation.recommendations = [
        "No se detectaron alertas clínicas relevantes en este momento.",
      ];
    }

    return res.status(200).json({
      success: true,
      patientId,
      evaluation,
    });
  } catch (error) {
    console.error("[Error] Error al evaluar paciente:", error);
    return res
      .status(500)
      .json({ message: "Error interno al evaluar paciente." });
  }
};
