import mongoose from "mongoose";
import Appointment from "../models/appointment.model.js";
import Users from "../models/user.model.js";
import { createAlertsFromAI } from "../services/alert.service.js";
import { crearNotificacion } from "../services/notification.service.js";

const isValidTime = (timeStr) => {
  const [hour, minute] = timeStr.split(":").map(Number);
  return hour >= 8 && (hour < 18 || (hour === 18 && minute === 0));
};

export const createAppointment = async (req, res) => {
  const doctorId = req.user.id;
  const { patientId, date, time, reason } = req.body;

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
        message: "No autorizado para agendar citas con este paciente",
      });
    }

    const appointmentDate = new Date(`${date}T${time}:00`);

    if (appointmentDate < new Date()) {
      return res
        .status(400)
        .json({ message: "No se puede agendar citas en el pasado" });
    }

    if (!isValidTime(time)) {
      return res
        .status(400)
        .json({ message: "Horario fuera del rango laboral (08:00–18:00)" });
    }

    const start = new Date(appointmentDate);
    const end = new Date(start.getTime() + 30 * 60 * 1000);

    const conflict = await Appointment.findOne({
      doctor: doctorId,
      status: { $in: ["pendiente", "confirmada"] },
      date: { $gte: start, $lt: end },
    });

    if (conflict) {
      return res.status(409).json({
        message: "El doctor ya tiene una cita programada en ese horario",
      });
    }

    const newAppointment = new Appointment({
      doctor: doctorId,
      patient: patientId,
      date: appointmentDate,
      time,
      reason,
      status: "pendiente",
      history: [
        {
          action: "creada",
          date: new Date(),
          updatedBy: doctorId,
        },
      ],
    });

    await newAppointment.save();

    await crearNotificacion({
      recipientId: patientId,
      title: "Nueva cita médica programada",
      message: `Tu doctor ha programado una nueva cita para el ${date} a las ${time}.`,
      type: "cita",
    });

    res.status(201).json(newAppointment);
  } catch (error) {
    console.error("[Error] Error en createAppointment:", error);
    res.status(500).json({ message: "Error al crear cita médica" });
  }
};

export const getAppointmentsByPatient = async (req, res) => {
  const { patientId } = req.params;
  const requesterId = req.user.id;
  const { startDate, endDate, page = 1, limit = 10 } = req.query;

  try {
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const patient = await Users.findById(patientId);
    if (!patient || patient.role !== "patient") {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }

    const isOwner = String(patient._id) === String(requesterId);
    const isDoctor = String(patient.doctor) === String(requesterId);

    if (!isOwner && !isDoctor) {
      return res
        .status(403)
        .json({ message: "No autorizado para ver estas citas" });
    }

    const filter = { patient: patientId };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const appointments = await Appointment.find(filter)
      .sort({ date: 1, time: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json(appointments);
  } catch (error) {
    console.error("[Error] Error en getAppointmentsByPatient:", error);
    res.status(500).json({ message: "Error al obtener citas" });
  }
};

export const getAppointmentsByDoctor = async (req, res) => {
  const doctorId = req.user.id;
  const { startDate, endDate, page = 1, limit = 10 } = req.query;

  try {
    const filter = { doctor: doctorId };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const appointments = await Appointment.find(filter)
      .sort({ date: 1, time: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("patient", "username email");

    res.status(200).json(appointments);
  } catch (error) {
    console.error("[Error] Error en getAppointmentsByDoctor:", error);
    res.status(500).json({ message: "Error al obtener citas del doctor" });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  const { appointmentId } = req.params;
  const { newStatus } = req.body;
  const doctorId = req.user.id;

  const validStatuses = ["confirmada", "asistió", "no asistió", "cancelada"];
  if (!validStatuses.includes(newStatus)) {
    return res.status(400).json({ message: "Estado de cita inválido" });
  }

  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    if (String(appointment.doctor) !== String(doctorId)) {
      return res
        .status(403)
        .json({ message: "No autorizado para modificar esta cita" });
    }

    appointment.status = newStatus;
    appointment.history.push({
      action: newStatus,
      date: new Date(),
      updatedBy: doctorId,
    });

    await appointment.save();

    await crearNotificacion({
      recipientId: appointment.patient,
      title: "Estado de cita actualizado",
      message: `El estado de tu cita fue actualizado a: ${newStatus}`,
      type: "cita",
    });

    if (["asistió", "no asistió"].includes(newStatus)) {
      await createAlertsFromAI(appointment.patient, doctorId, []);
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error("[Error] Error en updateAppointmentStatus:", error);
    res.status(500).json({ message: "Error al actualizar estado de cita" });
  }
};

export const rescheduleAppointment = async (req, res) => {
  const { appointmentId } = req.params;
  const { date, time } = req.body;
  const doctorId = req.user.id;

  try {
    if (!date || !time) {
      return res
        .status(400)
        .json({ message: "Se requieren nueva fecha y hora" });
    }

    const newDate = new Date(`${date}T${time}:00`);

    if (isNaN(newDate.getTime())) {
      return res.status(400).json({ message: "Fecha u hora inválida" });
    }

    if (newDate < new Date()) {
      return res
        .status(400)
        .json({ message: "No se puede reprogramar a una fecha pasada" });
    }

    if (!isValidTime(time)) {
      return res
        .status(400)
        .json({ message: "Horario fuera del rango laboral (08:00–18:00)" });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    if (String(appointment.doctor) !== String(doctorId)) {
      return res
        .status(403)
        .json({ message: "No autorizado para modificar esta cita" });
    }

    const start = new Date(newDate);
    const end = new Date(start.getTime() + 30 * 60 * 1000);

    const conflict = await Appointment.findOne({
      doctor: doctorId,
      status: { $in: ["pendiente", "confirmada"] },
      date: { $gte: start, $lt: end },
      _id: { $ne: appointmentId },
    });

    if (conflict) {
      return res
        .status(400)
        .json({ message: "El doctor ya tiene una cita en ese horario" });
    }

    appointment.date = newDate;
    appointment.time = time;
    appointment.status = "confirmada";
    appointment.history.push({
      action: "reprogramada",
      date: new Date(),
      updatedBy: doctorId,
    });

    await appointment.save();

    await crearNotificacion({
      recipientId: appointment.patient,
      title: "Cita reprogramada",
      message: `Tu cita fue reprogramada para el ${date} a las ${time}`,
      type: "cita",
    });

    res.status(200).json(appointment);
  } catch (error) {
    console.error("[Error] Error en rescheduleAppointment:", error);
    res.status(500).json({ message: "Error al reprogramar cita" });
  }
};

export const deleteAppointment = async (req, res) => {
  const { appointmentId } = req.params;
  const userId = req.user.id;
  const role = req.user.role;

  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    const isOwner = String(appointment.patient) === String(userId);
    const isDoctor = String(appointment.doctor) === String(userId);

    if (!isOwner && !isDoctor && role !== "admin") {
      return res
        .status(403)
        .json({ message: "No autorizado para eliminar esta cita" });
    }

    if (appointment.status === "asistió") {
      return res
        .status(400)
        .json({ message: "No se puede eliminar una cita ya atendida" });
    }

    await appointment.deleteOne();

    if (isOwner) {
      await crearNotificacion({
        recipientId: appointment.doctor,
        title: "Cita cancelada por el paciente",
        message: `El paciente ha cancelado la cita programada para el ${appointment.date}`,
        type: "cita",
      });
    }
    if (!isOwner) {
      await crearNotificacion({
        recipientId: appointment.patient,
        title: "Cita cancelada",
        message: "Tu cita ha sido cancelada por el doctor",
        type: "cita",
      });
    }

    res.status(200).json({ message: "Cita eliminada correctamente" });
  } catch (error) {
    console.error("[Error] Error en deleteAppointment:", error);
    res.status(500).json({ message: "Error al eliminar cita" });
  }
};


export const getAppointmentHistory = async (req, res) => {
  const { appointmentId } = req.params;
  const userId = req.user.id;

  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    const isDoctor = String(appointment.doctor) === String(userId);
    const isPatient = String(appointment.patient) === String(userId);

    if (!isDoctor && !isPatient) {
      return res
        .status(403)
        .json({ message: "No autorizado para ver historial" });
    }

    res.status(200).json(appointment.history);
  } catch (error) {
    console.error("[Error] Error en getAppointmentHistory:", error);
    res.status(500).json({ message: "Error al obtener historial de cita" });
  }
};

export const getUpcomingAppointmentsForUser = async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  try {
    const today = new Date();
    let filter = {
      date: { $gte: today },
      status: { $in: ["pendiente", "confirmada"] },
    };

    if (role === "patient") {
      filter.patient = userId;
    } else if (role === "doctor") {
      filter.doctor = userId;
    } else {
      return res.status(403).json({ message: "Rol no autorizado" });
    }

    const appointments = await Appointment.find(filter)
      .sort({ date: 1, time: 1 })
      .populate("patient", "username")
      .populate("doctor", "username");

    res.status(200).json(appointments);
  } catch (error) {
    console.error("[Error] Error en getUpcomingAppointmentsForUser:", error);
    res.status(500).json({ message: "Error al obtener próximas citas" });
  }
};
