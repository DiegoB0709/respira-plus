import Alert from "../models/alert.model.js";
import Users from "../models/user.model.js";
import mongoose from "mongoose";

export const getAlertsByDoctor = async (req, res) => {
  const doctorId = req.user.id;

  try {
    const alerts = await Alert.find({ doctor: doctorId })
      .populate("patient", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json(alerts);
  } catch (error) {
    console.error("Error al obtener alertas del doctor:", error);
    res.status(500).json({ message: "Error al obtener alertas" });
  }
};

export const getAlertsByPatient = async (req, res) => {
  const { patientId } = req.params;
  const requesterId = req.user.id;
  const requesterRole = req.user.role;

  try {
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ message: "ID de paciente inválido" });
    }

    const patient = await Users.findById(patientId);
    if (!patient || patient.role !== "patient") {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }

    const isOwner = String(patient._id) === String(requesterId);
    const isDoctor = String(patient.doctor) === String(requesterId);

    if (!isOwner && !isDoctor) {
      return res.status(403).json({ message: "No autorizado" });
    }

    const alerts = await Alert.find({ patient: patientId })
      .sort({
        createdAt: -1,
      })
      .populate("doctor", "username");;

    res.status(200).json(alerts);
  } catch (error) {
    console.error("[Error] Error al obtener alertas del paciente:", error);
    res.status(500).json({ message: "Error al obtener alertas del paciente" });
  }
};

export const updateAlertStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, actionTaken } = req.body;

    const allowedStatuses = ["activa", "revisada", "resuelta"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message:
          "Estado de alerta no válido. Usa: activa, revisada o resuelta.",
      });
    }

    const updatedAlert = await Alert.findByIdAndUpdate(
      id,
      {
        status,
        ...(actionTaken !== undefined && { actionTaken }),
      },
      { new: true }
    );

    if (!updatedAlert) {
      return res.status(404).json({ message: "Alerta no encontrada" });
    }

    res.status(200).json({
      message: "Estado de alerta actualizado correctamente",
      alert: updatedAlert,
    });
  } catch (error) {
    console.error("[Error] Error al actualizar el estado de la alerta:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const getAlertById = async (req, res) => {
  const { alertId } = req.params;
  const userId = req.user.id;
  const role = req.user.role;

  try {
    const alert = await Alert.findById(alertId).populate(
      "patient",
      "username email"
    );

    if (!alert) {
      return res.status(404).json({ message: "Alerta no encontrada" });
    }

    const isPatient = String(alert.patient._id) === String(userId);
    const isDoctor = String(alert.doctor) === String(userId);

    if (!isPatient && !isDoctor && role !== "admin") {
      return res
        .status(403)
        .json({ message: "No autorizado para ver esta alerta" });
    }

    res.status(200).json(alert);
  } catch (error) {
    console.error("[Error] Error al obtener alerta:", error);
    res.status(500).json({ message: "Error al obtener alerta" });
  }
};
