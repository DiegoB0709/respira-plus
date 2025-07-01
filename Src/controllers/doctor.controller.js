import mongoose from "mongoose";
import User from "../models/user.model.js";

export const getMyPatients = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const {
      hasToken,
      username,
      email,
      phone,
      page = 1,
      limit = 10,
    } = req.query;

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(403).json({ message: "No autorizado" });
    }

    const patientFilter = {
      doctor: doctorId,
    };

    if (hasToken === "true") {
      patientFilter.registrationToken = { $exists: true, $ne: "" };
    } else  {
      patientFilter.registrationToken = { $in: [null, ""] };
    }

    if (username) {
      patientFilter.username = { $regex: username, $options: "i" };
    }

    if (email) {
      patientFilter.email = { $regex: email, $options: "i" };
    }

    if (phone) {
      patientFilter.phone = { $regex: phone, $options: "i" };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const patients = await User.find(patientFilter)
      .select("username email phone isActive registrationToken")
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(patientFilter);

    res.status(200).json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      patients,
    });
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
