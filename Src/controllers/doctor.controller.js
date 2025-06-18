import mongoose from "mongoose";
import User from "../models/user.model.js";

export const getMyPatients = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const doctor = await User.findById(doctorId).populate({
      path: "assignedPatients",
      select: "username email phone isActive",
    });

    if (!doctor || doctor.role !== "doctor") {
      return res.status(403).json({ message: "No autorizado" });
    }

    res.status(200).json({ patients: doctor.assignedPatients });
  } catch (error) {
    console.error("[Error] Error al obtener pacientes:", error);
    res.status(500).json({ message: "Error al obtener la lista de pacientes" });
  }
};

export const updatePatientInfo = async (req, res) => {
  const { patientId } = req.params;
  const doctorId = req.user.id;
  const { username, phone } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ message: "ID de paciente inválido" });
    }

    const patient = await User.findById(patientId);
    if (!patient || patient.role !== "patient") {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }

    if (String(patient.doctor) !== String(doctorId)) {
      return res
        .status(403)
        .json({ message: "No autorizado para modificar este paciente" });
    }

    patient.username = username ?? patient.username;
    patient.phone = phone ?? patient.phone;

    await patient.save();

    res
      .status(200)
      .json({ message: "Datos del paciente actualizados", patient });
  } catch (error) {
    console.error("[Error] Error al actualizar datos del paciente:", error);
    res
      .status(500)
      .json({ message: "Error al actualizar información del paciente" });
  }
};
