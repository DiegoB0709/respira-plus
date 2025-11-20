import mongoose from "mongoose";
import Treatment from "../models/treatment.model.js";
import Users from "../models/user.model.js";
import TreatmentHistory from "../models/treatmentHistory.model.js";
import DailyCompliance from "../models/dailyCompliance.model.js";
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

    let existingTreatment = await Treatment.findOne({ patient: patientId });

    const payload = { ...treatmentData, doctor: doctorId };

    const isRecurrenceNormalized =
      payload.isRecurrence === true ||
      payload.isRecurrence === "true" ||
      payload.isRecurrence === 1 ||
      payload.isRecurrence === "1";

    payload.isRecurrence = isRecurrenceNormalized;

    if (!isRecurrenceNormalized) {
      payload.recurrenceReason = undefined;
    } else {
      if (!payload.recurrenceReason || payload.recurrenceReason.trim() === "") {
        return res
          .status(400)
          .json({ message: "La razón de recurrencia es requerida" });
      }
    }

    if (existingTreatment) {
      if (existingTreatment.status === "Finalizado") {
        await Treatment.findOneAndDelete({ _id: existingTreatment._id });
        existingTreatment = null;
      }

      if (existingTreatment && existingTreatment.status === "Activo") {
        const updateQuery = {
          $set: {
            ...payload,
            updatedAt: new Date(),
          },
        };

        delete updateQuery.$set.recurrenceReason;

        if (isRecurrenceNormalized) {
          updateQuery.$set.recurrenceReason = payload.recurrenceReason;
        } else {
          updateQuery.$unset = { recurrenceReason: "" };
        }

        const updated = await Treatment.findOneAndUpdate(
          { patient: patientId },
          updateQuery,
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
            isRecurrence: updated.isRecurrence,
            recurrenceReason: updated.recurrenceReason,
          },
          actionBy: doctorId,
        });

        const evaluation = await evaluatePatient(patientId);
        await createAlertsFromAI(
          patientId,
          doctorId,
          evaluation.triggeredRules
        );

        await crearNotificacion({
          recipientId: patientId,
          title: "Tratamiento actualizado",
          message: "Tu tratamiento ha sido actualizado por tu médico.",
          type: "info",
        });

        return res.status(200).json(updated);
      }
    }

    if (!existingTreatment) {
      const newTreatment = new Treatment({
        ...payload,
        patient: patientId,
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
          isRecurrence: newTreatment.isRecurrence,
          recurrenceReason: newTreatment.recurrenceReason,
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
  const { observation, abandonment } = req.body;

  if (!observation || observation.trim().length === 0) {
    return res.status(400).json({
      message: "La observación final es obligatoria y no puede estar vacía.",
    });
  }

  try {
    const patient = await Users.findById(patientId);
    if (!patient || patient.role !== "patient") {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }

    if (String(patient.doctor) !== String(doctorId)) {
      return res
        .status(403)
        .json({ message: "No autorizado para finalizar/eliminar tratamiento" });
    }

    const currentTreatment = await Treatment.findOne({
      patient: patientId,
      status: "Activo",
    });
    if (!currentTreatment) {
      return res
        .status(404)
        .json({ message: "Tratamiento activo no encontrado" });
    }

    const updatedTreatment = await Treatment.findOneAndUpdate(
      { _id: currentTreatment._id },
      {
        status: "Finalizado",
        abandonment: !!abandonment,
        finalObservation: observation,
        observationDate: new Date(),
        updatedAt: new Date(),
      },
      { new: true }
    );

    await TreatmentHistory.create({
      action: "delete",
      patient: patientId,
      doctor: doctorId,
      treatment: updatedTreatment._id,
      treatmentSnapshot: {
        startDate: updatedTreatment.startDate,
        endDate: updatedTreatment.endDate,
        medications: updatedTreatment.medications,
        notes: updatedTreatment.notes,
        finalObservation: updatedTreatment.finalObservation,
        abandonment: updatedTreatment.abandonment,
        observationDate: updatedTreatment.observationDate,
      },
      actionBy: doctorId,
      observation: `Tratamiento finalizado/eliminado manualmente. Abandono: ${
        updatedTreatment.abandonment ? "Sí" : "No"
      }. Observación: ${observation || "N/A"}`,
    });

    await crearNotificacion({
      recipientId: patientId,
      title: "Tratamiento Finalizado",
      message: `Tu tratamiento ha sido finalizado por tu médico. Motivo: ${
        updatedTreatment.abandonment ? "Abandono" : "Manual"
      }.`,
      type: "info",
    });

    res.status(200).json({
      message: "Tratamiento finalizado correctamente (marcado como eliminado)",
    });
  } catch (error) {
    console.error("[Error] Error en deleteTreatment:", error);
    res.status(500).json({ message: "Error al finalizar tratamiento" });
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

export const finishTreatment = async (req, res) => {
  const { patientId } = req.params;
  const doctorId = req.user.id;
  const { finalObservation, isRecurrence, recurrenceReason, observationDate } =
    req.body;

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
        message:
          "No autorizado para actualizar la observación de este tratamiento",
      });
    }

    const currentTreatment = await Treatment.findOne({ patient: patientId });

    if (!currentTreatment) {
      return res.status(404).json({ message: "Tratamiento no encontrado" });
    }

    if (currentTreatment.status !== "Finalizado") {
      return res.status(400).json({
        message:
          "Solo se puede actualizar la observación si el tratamiento ha sido Finalizado (por el cron o manualmente).",
      });
    }

    currentTreatment.finalObservation = finalObservation;
    currentTreatment.isRecurrence = isRecurrence || false;
    currentTreatment.recurrenceReason = isRecurrence
      ? recurrenceReason
      : undefined;
    currentTreatment.observationDate = observationDate || new Date();
    currentTreatment.updatedAt = new Date();

    const updatedTreatment = await currentTreatment.save();

    await TreatmentHistory.create({
      action: "finished",
      patient: patientId,
      doctor: doctorId,
      treatment: updatedTreatment._id,
      treatmentSnapshot: {
        startDate: updatedTreatment.startDate,
        endDate: updatedTreatment.endDate,
        medications: updatedTreatment.medications,
        notes: updatedTreatment.notes,
        finalObservation: updatedTreatment.finalObservation,
        isRecurrence: updatedTreatment.isRecurrence,
        recurrenceReason: updatedTreatment.recurrenceReason,
        observationDate: updatedTreatment.observationDate,
      },
      actionBy: doctorId,
      observation: `Observaciones finales añadidas por el médico. Recurrencia: ${
        updatedTreatment.isRecurrence ? "Sí" : "No"
      }`,
    });

    await crearNotificacion({
      recipientId: patientId,
      title: "Observación de Tratamiento Finalizado",
      message:
        "Tu médico ha agregado observaciones finales a tu tratamiento terminado.",
      type: "info",
    });

    return res.status(200).json(updatedTreatment);
  } catch (error) {
    console.error("[Error] Error en finishTreatment:", error);
    res.status(500).json({
      message: "Error al actualizar la observación del tratamiento finalizado",
    });
  }
};

export const recordDailyCompliance = async (req, res) => {
  const treatmentId = req.params.treatmentId;
  const patientId = req.user.id;

  if (!treatmentId || !mongoose.Types.ObjectId.isValid(treatmentId)) {
    return res
      .status(400)
      .json({ message: "ID de tratamiento inválido o faltante." });
  }

  if (!patientId) {
    return res
      .status(401)
      .json({
        message: "Usuario no autenticado o ID de paciente no encontrado.",
      });
  }

  try {
    const today = new Date();
    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    const query = {
      treatment: treatmentId,
      patient: patientId,
      date: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
    };

    const update = {
      $set: {
        status: "Cumplió",
        date: startOfToday,
      },
    };

    const options = {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    };

    const complianceRecord = await DailyCompliance.findOneAndUpdate(
      query,
      update,
      options
    );

    res.status(200).json({
      message: "Registro de cumplimiento diario actualizado a 'Cumplió'.",
      record: complianceRecord,
    });
  } catch (error) {
    console.error("Error al registrar el cumplimiento diario:", error);
    res
      .status(500)
      .json({
        message: "Error interno del servidor al registrar el cumplimiento.",
      });
  }
};

export const checkDailyCompliance = async (req, res) => {
  const treatmentId = req.params.treatmentId;
  const patientId = req.user.id;

  if (!treatmentId || !mongoose.Types.ObjectId.isValid(treatmentId)) {
    return res
      .status(400)
      .json({ message: "ID de tratamiento inválido o faltante." });
  }

  if (!patientId) {
    return res
      .status(401)
      .json({
        message: "Usuario no autenticado o ID de paciente no encontrado.",
      });
  }

  try {
    const today = new Date();
    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    const complianceRecord = await DailyCompliance.findOne({
      treatment: treatmentId,
      patient: patientId,
      status: "Cumplió",
      date: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
    })
      .select("_id")
      .lean()
      .exec();

    const complied = !!complianceRecord;

    res.status(200).json(complied);
  } catch (error) {
    console.error("Error al verificar el cumplimiento diario:", error);
    res
      .status(500)
      .json({
        message: "Error interno del servidor al verificar el cumplimiento.",
      });
  }
};