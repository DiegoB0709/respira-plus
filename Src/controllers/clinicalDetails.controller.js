import ClinicalDetails from "../models/clinicalDetails.model.js";
import Users from "../models/user.model.js";
import mongoose from "mongoose";
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
      return res.status(403).json({
        message: "No autorizado para modificar este paciente",
      });
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
