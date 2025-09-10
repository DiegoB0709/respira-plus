import mongoose from "mongoose";
import Treatment from "../models/treatment.model.js";
import Users from "../models/user.model.js";
import TreatmentHistory from "../models/treatmentHistory.model.js";
import { evaluatePatient } from "../services/ai.service.js";
import { createAlertsFromAI } from "../services/alert.service.js";
import { crearNotificacion } from "../services/notification.service.js";

export const createOrUpdateTreatment = async (req, res) => {
  const { patientId } = req.params;
  const doctorId = req.user.id;
  const treatmentData = req.body;

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
        message: "No autorizado para modificar tratamiento",
      });
    }

    const existingTreatment = await Treatment.findOne({ patient: patientId });

    if (existingTreatment) {
      const updated = await Treatment.findOneAndUpdate(
        { patient: patientId },
        {
          $set: {
            ...treatmentData,
            doctor: doctorId,
            updatedAt: new Date(),
          },
        },
        { new: true }
      );

      await TreatmentHistory.create({
        action: "update",
        patient: patientId,
        doctor: doctorId,
        treatment: updated._id,
        treatmentSnapshot: {
          startDate: updated.startDate,
          endDate: updated.endDate,
          medications: updated.medications,
          notes: updated.notes,
        },
        actionBy: doctorId,
      });

      const evaluation = await evaluatePatient(patientId);
      await createAlertsFromAI(patientId, doctorId, evaluation.triggeredRules);

      await crearNotificacion({
        recipientId: patientId,
        title: "Tratamiento actualizado",
        message: "Tu tratamiento ha sido actualizado por tu médico.",
        type: "info",
      });

      return res.status(200).json(updated);
    } else {
      const newTreatment = new Treatment({
        ...treatmentData,
        patient: patientId,
        doctor: doctorId,
      });
      await newTreatment.save();

      await TreatmentHistory.create({
        action: "create",
        patient: patientId,
        doctor: doctorId,
        treatment: newTreatment._id,
        treatmentSnapshot: {
          startDate: newTreatment.startDate,
          endDate: newTreatment.endDate,
          medications: newTreatment.medications,
          notes: newTreatment.notes,
        },
        actionBy: doctorId,
      });

      const evaluation = await evaluatePatient(patientId);
      await createAlertsFromAI(patientId, doctorId, evaluation.triggeredRules);

      await crearNotificacion({
        recipientId: patientId,
        title: "Nuevo tratamiento registrado",
        message: "Tu médico ha registrado un nuevo tratamiento.",
        type: "info",
      });

      return res.status(201).json(newTreatment);
    }
  } catch (error) {
    console.error("[Error] Error en createOrUpdateTreatment:", error);
    res.status(500).json({ message: "Error al guardar tratamiento" });
  }
};

export const getTreatmentByPatient = async (req, res) => {
  const { patientId } = req.params;
  const userId = req.user.id;

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
        .json({ message: "No autorizado para ver el tratamiento" });
    }

    const treatment = await Treatment.findOne({ patient: patientId });
    if (!treatment) {
      return res.status(404).json({ message: "Tratamiento no encontrado" });
    }

    res.status(200).json(treatment);
  } catch (error) {
    console.error("[Error] Error en getTreatmentByPatient:", error);
    res.status(500).json({ message: "Error al obtener tratamiento" });
  }
};

export const getAllTreatmentsForDoctor = async (req, res) => {
  const doctorId = req.user.id;

  try {
    const doctor = await Users.findById(doctorId).populate("assignedPatients");
    if (!doctor || doctor.role !== "doctor") {
      return res.status(403).json({ message: "No autorizado" });
    }

    const patientIds = doctor.assignedPatients.map((p) => p._id);

    const treatments = await Treatment.find({
      patient: { $in: patientIds },
    }).populate({
      path: "patient",
      select: "username email phone",
    });

    res.status(200).json(treatments);
  } catch (error) {
    console.error("[Error] Error en getAllTreatmentsForDoctor:", error);
    res.status(500).json({ message: "Error al obtener tratamientos" });
  }
};

export const deleteTreatment = async (req, res) => {
  const { patientId } = req.params;
  const doctorId = req.user.id;

  try {
    const patient = await Users.findById(patientId);
    if (!patient || patient.role !== "patient") {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }

    if (String(patient.doctor) !== String(doctorId)) {
      return res
        .status(403)
        .json({ message: "No autorizado para eliminar tratamiento" });
    }

    const currentTreatment = await Treatment.findOne({ patient: patientId });
    if (!currentTreatment) {
      return res.status(404).json({ message: "Tratamiento no encontrado" });
    }

    await TreatmentHistory.create({
      action: "delete",
      patient: patientId,
      doctor: doctorId,
      treatment: currentTreatment._id,
      treatmentSnapshot: {
        startDate: currentTreatment.startDate,
        endDate: currentTreatment.endDate,
        medications: currentTreatment.medications,
        notes: currentTreatment.notes,
      },
      actionBy: doctorId,
    });

    await Treatment.findOneAndDelete({ patient: patientId });
    await crearNotificacion({
      recipientId: patientId,
      title: "Tratamiento eliminado",
      message: "Tu tratamiento anterior ha sido eliminado por tu médico.",
      type: "info",
    });

    res.status(200).json({ message: "Tratamiento eliminado correctamente" });
  } catch (error) {
    console.error("[Error] Error en deleteTreatment:", error);
    res.status(500).json({ message: "Error al eliminar tratamiento" });
  }
};

export const getTreatmentHistory = async (req, res) => {
  const { patientId } = req.params;
  const userId = req.user.id;

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
      return res.status(403).json({
        message: "No autorizado para ver el historial",
      });
    }

    const history = await TreatmentHistory.find({ patient: patientId })
      .sort({ createdAt: -1 })
      .populate("doctor", "username")
      .populate("actionBy", "username role");

    res.status(200).json(history);
  } catch (error) {
    console.error("[Error] Error en getTreatmentHistory:", error);
    res.status(500).json({ message: "Error al obtener historial" });
  }
};
