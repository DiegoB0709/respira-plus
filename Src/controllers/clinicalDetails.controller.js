import ClinicalDetails from "../models/clinicalDetails.model.js";
import Users from "../models/user.model.js";
import mongoose from "mongoose";
import ClinicalHistory from "../models/clinicalHistory.model.js";
import { evaluatePatient } from "../services/ai.service.js";
import { createAlertsFromAI } from "../services/alert.service.js";
import { crearNotificacion } from "../services/notification.service.js";

export const createOrUpdateClinicalDetails = async (req, res) => {
  const { patientId } = req.params;
  const doctorId = req.user.id;
  const data = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ message: "ID de paciente inválido" });
    }

    const patient = await Users.findById(patientId);
    if (!patient || patient.role !== "patient") {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }

    if (String(patient.doctor) !== String(doctorId)) {
      return res
        .status(403)
        .json({ message: "No autorizado para modificar este paciente" });
    }

    if (data.weight && (data.weight < 20 || data.weight > 300)) {
      return res
        .status(400)
        .json({ message: "El peso debe estar entre 20 y 300 kg" });
    }

    if (data.height && (data.height < 80 || data.height > 250)) {
      return res
        .status(400)
        .json({ message: "La altura debe estar entre 80 y 250 cm" });
    }

    if (
      data.bacteriologicalStatus &&
      !["positivo", "negativo", "no confirmado"].includes(
        data.bacteriologicalStatus
      )
    ) {
      return res
        .status(400)
        .json({ message: "Estado bacteriológico inválido" });
    }

    if (
      data.phase &&
      !["inicio", "intermedio", "final", "indefinido"].includes(data.phase)
    ) {
      return res.status(400).json({ message: "Fase inválida" });
    }

    if (
      data.hivStatus &&
      !["positivo", "negativo", "desconocido"].includes(data.hivStatus)
    ) {
      return res.status(400).json({ message: "Estado VIH inválido" });
    }

    if (
      data.adherenceRisk &&
      !["bajo", "medio", "alto"].includes(data.adherenceRisk)
    ) {
      return res.status(400).json({ message: "Nivel de adherencia inválido" });
    }

    if (data.clinicalNotes && data.clinicalNotes.length > 1000) {
      return res
        .status(400)
        .json({
          message: "Las notas clínicas no deben superar los 1000 caracteres",
        });
    }

    if (data.symptoms && data.symptoms.some((s) => s.length > 200)) {
      return res
        .status(400)
        .json({ message: "Cada síntoma no debe superar los 200 caracteres" });
    }

    if (data.comorbidities && data.comorbidities.some((c) => c.length > 200)) {
      return res
        .status(400)
        .json({
          message: "Cada comorbilidad no debe superar los 200 caracteres",
        });
    }

    const booleanFields = [
      "smoking",
      "alcoholUse",
      "contactWithTb",
      "priorTbTreatment",
    ];
    for (const field of booleanFields) {
      if (data[field] !== undefined && typeof data[field] !== "boolean") {
        return res
          .status(400)
          .json({ message: `El campo ${field} debe ser booleano` });
      }
    }

    let result;
    const existingDetails = await ClinicalDetails.findOne({
      patient: patientId,
    });

    if (existingDetails) {
      result = await ClinicalDetails.findOneAndUpdate(
        { patient: patientId },
        { $set: data },
        { new: true }
      );
    } else {
      const newDetails = new ClinicalDetails({
        ...data,
        patient: patientId,
        createdBy: doctorId,
      });
      await newDetails.save();
      result = newDetails;
    }

    const historyEntry = new ClinicalHistory({
      patient: patientId,
      updatedBy: doctorId,
      weight: result.weight,
      bmi: result.bmi,
      symptoms: result.symptoms,
      clinicalNotes: result.clinicalNotes,
      phase: result.phase,
      bacteriologicalStatus: result.bacteriologicalStatus,
      comorbidities: result.comorbidities,
      hivStatus: result.hivStatus,
      smoking: result.smoking,
      alcoholUse: result.alcoholUse,
      contactWithTb: result.contactWithTb,
      priorTbTreatment: result.priorTbTreatment,
      adherenceRisk: result.adherenceRisk,
      snapshotDate: new Date(),
    });
    await historyEntry.save();

    const evaluation = await evaluatePatient(patientId);
    await createAlertsFromAI(patientId, doctorId, evaluation.triggeredRules);

    await crearNotificacion({
      recipientId: patientId,
      title: "Actualización clínica",
      message: `Tu información clínica ha sido ${
        existingDetails ? "actualizada" : "registrada"
      } por tu médico.`,
      type: "info",
    });

    return res.status(existingDetails ? 200 : 201).json(result);
  } catch (error) {
    console.error("[Error] Error en createOrUpdateClinicalDetails:", error);
    res.status(500).json({ message: "Error al guardar detalles clínicos" });
  }
};

export const getClinicalDetailsByPatient = async (req, res) => {
  const { patientId } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ message: "ID de paciente inválido" });
    }

    const patient = await Users.findById(patientId);
    if (!patient || patient.role !== "patient") {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }

    const isOwner = String(patient._id) === String(userId);
    const isDoctor = String(patient.doctor) === String(userId);

    if (!isOwner && !isDoctor) {
      return res
        .status(403)
        .json({ message: "No autorizado para ver estos datos" });
    }

    const clinicalDetails = await ClinicalDetails.findOne({
      patient: patientId,
    });
    if (!clinicalDetails) {
      return res
        .status(404)
        .json({ message: "No hay detalles clínicos registrados" });
    }

    res.status(200).json(clinicalDetails);
  } catch (error) {
    console.error("[Error] Error en getClinicalDetailsByPatient:", error);
    res.status(500).json({ message: "Error al obtener detalles clínicos" });
  }
};
