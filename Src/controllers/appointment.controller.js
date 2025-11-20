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
  const userId = req.user.id;
  const userRole = req.user.role;
  const { patientId, date, time, reason } = req.body;

  try {
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

    let doctorId, patientIdFinal;

    if (userRole === "doctor") {
      doctorId = userId;

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
          .json({
            message: "No autorizado para agendar citas con este paciente",
          });
      }

      patientIdFinal = patientId;
    } else if (userRole === "patient") {
      patientIdFinal = userId;

      const patient = await Users.findById(userId).populate("doctor");
      if (!patient || !patient.doctor) {
        return res
          .status(404)
          .json({ message: "No tienes un doctor asignado" });
      }

      doctorId = patient.doctor._id;
    } else {
      return res
        .status(403)
        .json({ message: "Rol no autorizado para crear citas" });
    }

    const start = new Date(appointmentDate);
    const end = new Date(start.getTime() + 30 * 60 * 1000);

    const conflict = await Appointment.findOne({
      doctor: doctorId,
      status: { $in: ["pendiente", "confirmada", "solicitada"] },
      date: { $gte: start, $lt: end },
    });

    if (conflict) {
      return res
        .status(409)
        .json({
          message: "El doctor ya tiene una cita programada en ese horario",
        });
    }

    const status = userRole === "doctor" ? "pendiente" : "solicitada";
    const action = userRole === "doctor" ? "creada" : "solicitada";

    const newAppointment = new Appointment({
      doctor: doctorId,
      patient: patientIdFinal,
      date: appointmentDate,
      time,
      reason,
      status,
      history: [{ action, date: new Date(), updatedBy: userId }],
    });

    await newAppointment.save();
    await newAppointment.populate("patient", "username email");

    const recipientId = userRole === "doctor" ? patientIdFinal : doctorId;
    const title =
      userRole === "doctor"
        ? "Nueva cita médica programada"
        : "Solicitud de cita médica";
    const message =
      userRole === "doctor"
        ? `Tu doctor ha programado una nueva cita para el ${date} a las ${time}. Confirma tu asistencia en la sección de citas.`
        : `El paciente ${req.user.username} ha solicitado una cita para el ${date} a las ${time}.`;

    await crearNotificacion({ recipientId, title, message, type: "cita" });

    res.status(201).json(newAppointment);
  } catch (error) {
    console.error("[Error] Error en createAppointment:", error);
    res.status(500).json({ message: "Error al crear cita médica" });
  }
};

export const getAppointments = async (req, res) => {
  const requesterId = req.user.id;
  const requesterRole = req.user.role;
  const {
    startDate,
    endDate,
    status,
    patientName = "",
    page = 1,
    limit = 10,
    patientId,
  } = req.query;

  try {
    const filter = {};

    if (requesterRole === "patient") {
      filter.patient = requesterId;
    } else if (requesterRole === "doctor") {
      filter.doctor = requesterId;

      if (patientId) {
        const doctor = await Users.findById(requesterId).select(
          "assignedPatients"
        );

        if (!doctor) {
          return res.status(404).json({ message: "Doctor no encontrado" });
        }

        const isAssigned = doctor.assignedPatients.some(
          (assignedId) => assignedId.toString() === patientId
        );

        if (!isAssigned) {
          return res
            .status(403)
            .json({ message: "No tienes acceso a este paciente" });
        }

        filter.patient = patientId;
      }
    } else if (requesterRole !== "admin") {
      return res.status(403).json({ message: "No autorizado para ver citas" });
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    if (status) {
      filter.status = status;
    }

    if (patientName) {
      const patients = await Users.find({
        role: "patient",
        username: { $regex: patientName, $options: "i" },
      }).select("_id");

      if (patients.length > 0) {
        filter.patient = { $in: patients.map((p) => p._id) };
      } else {
        return res.status(200).json({ total: 0, appointments: [] });
      }

      if (requesterRole === "patient") {
        filter.patient = requesterId;
      }
    }

    const total = await Appointment.countDocuments(filter);

    const appointments = await Appointment.find(filter)
      .sort({ date: 1, time: 1 })
      .populate([
        { path: "patient", select: "username email" },
        { path: "doctor", select: "username email" },
      ])
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({ total, appointments });
  } catch (error) {
    console.error("[Error] Error en getAppointments:", error);
    res.status(500).json({ message: "Error al obtener citas" });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  const { appointmentId } = req.params;
  const { newStatus } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  const validStatuses = ["asistió", "no asistió", "cancelada", "confirmada"];
  if (!validStatuses.includes(newStatus)) {
    return res.status(400).json({ message: "Estado de cita inválido" });
  }

  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    const isDoctor =
      String(appointment.doctor) === String(userId) && userRole === "doctor";
    const isOwner =
      String(appointment.patient) === String(userId) && userRole === "patient";

    if (!isDoctor && !isOwner) {
      return res
        .status(403)
        .json({ message: "No autorizado para modificar esta cita" });
    }

    appointment.status = newStatus;
    appointment.history.push({
      action: newStatus,
      date: new Date(),
      updatedBy: userId,
    });

    await appointment.save();

    await appointment.populate([
      { path: "patient", select: "username" },
      { path: "doctor", select: "username" },
    ]);

    let recipientId, title, message;

    if (userRole === "doctor") {
      recipientId = appointment.patient;
      title = "Estado de tu cita actualizado por el doctor";
      message = `El doctor ${appointment.doctor.username} actualizó tu cita a: ${newStatus}`;
    } else if (userRole === "patient") {
      recipientId = appointment.doctor;
      title = "Estado de cita actualizado por el paciente";
      message = `El paciente ${appointment.patient.username} actualizó la cita a: ${newStatus}`;
    }

    await crearNotificacion({
      recipientId,
      title,
      message,
      type: "cita",
    });

    if (newStatus === "no asistió") {
      await createAlertsFromAI(appointment.patient, appointment.doctor, [
        "ABN02",
      ]);
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
      status: { $in: ["pendiente", "confirmada","solicitada"] },
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
    await appointment.populate([
      { path: "patient", select: "username" },
      { path: "doctor", select: "username" },
    ]);

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
        .json({ message: "No autorizado para cancelar esta cita" });
    }

    if (appointment.status === "asistió") {
      return res
        .status(400)
        .json({ message: "No se puede cancelar una cita ya atendida" });
    }

    if (appointment.status === "cancelada") {
      return res
        .status(400)
        .json({ message: "La cita ya fue cancelada previamente" });
    }

    appointment.status = "cancelada";
    appointment.history.push({
      action: "cancelada",
      date: new Date(),
      updatedBy: userId,
    });

    await appointment.save();

    if (isOwner) {
      await crearNotificacion({
        recipientId: appointment.doctor,
        title: "Cita cancelada por el paciente",
        message: `El paciente ha cancelado la cita programada para el ${appointment.date}`,
        type: "cita",
      });

      await createAlertsFromAI(appointment.patient, appointment.doctor, [
        "ABN03",
      ]);
    } else {
      await crearNotificacion({
        recipientId: appointment.patient,
        title: "Cita cancelada",
        message: "Tu cita ha sido cancelada por el doctor",
        type: "cita",
      });
    }

    res.status(200).json({ message: "Cita cancelada correctamente" });
  } catch (error) {
    console.error("[Error] Error al cancelar cita:", error);
    res.status(500).json({ message: "Error al cancelar cita" });
  }
};

export const getAppointmentHistory = async (req, res) => {
  const { appointmentId } = req.params;
  const userId = req.user.id;

  try {
    const appointment = await Appointment.findById(appointmentId).populate({
      path: "history.updatedBy",
      select: "username role",
    });

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

export const updateAppointmentTimes = async (req, res) => {
  const { appointmentId } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    const isDoctor =
      String(appointment.doctor) === String(userId) && userRole === "doctor";
    const isPatient =
      String(appointment.patient) === String(userId) && userRole === "patient";

    if (!isDoctor && !isPatient) {
      return res
        .status(403)
        .json({ message: "No autorizado para modificar esta cita" });
    }

    const now = new Date();
    let updateField = {};
    let historyAction = "";
    let notificationTitle = "";
    let notificationMessage = "";
    let recipientId;

    if (isPatient) {
      if (appointment.arrivalTime) {
        return res
          .status(400)
          .json({ message: "La hora de llegada ya ha sido marcada" });
      }
      updateField = { arrivalTime: now };
      recipientId = appointment.doctor;
      notificationTitle = "Paciente ha llegado";
      notificationMessage = `El paciente ${req.user.username} ha marcado su hora de llegada para la cita.`;
    } else if (isDoctor) {
      if (!appointment.arrivalTime) {
        return res.status(400).json({
          message:
            "No se puede iniciar la atención sin registrar la hora de llegada del paciente",
        });
      }
      if (appointment.consultationStartTime) {
        return res
          .status(400)
          .json({ message: "La hora de atención ya ha sido marcada" });
      }
      updateField = {
        consultationStartTime: now,
        status: "asistió",
      };
      historyAction = "asistió";
      recipientId = appointment.patient;
      notificationTitle = "Consulta iniciada";
      notificationMessage = `El doctor ${req.user.username} ha iniciado la consulta.`;
    } else {
      return res
        .status(400)
        .json({ message: "Rol no válido para esta operación de tiempo" });
    }

    Object.assign(appointment, updateField);

    if (historyAction) {
      appointment.history.push({
        action: historyAction,
        date: now,
        updatedBy: userId,
      });
    }

    await appointment.save();

    await crearNotificacion({
      recipientId,
      title: notificationTitle,
      message: notificationMessage,
      type: "cita",
    });

    res.status(200).json(appointment);
  } catch (error) {
    console.error("[Error] Error en updateAppointmentTimes:", error);
    res.status(500).json({ message: "Error al actualizar tiempos de cita" });
  }
};