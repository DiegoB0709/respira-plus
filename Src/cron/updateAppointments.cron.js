import cron from "node-cron";
import mongoose from "mongoose";
import Appointment from "../models/appointment.model.js";
import { crearNotificacion } from "../services/notification.service.js";

const SERVER_USER_ID = new mongoose.Types.ObjectId(process.env.SERVER_USER_ID);

export const startUpdateAppointmentsCron = async () => {
  console.log("[CRON] Iniciando CRON de actualización automática de citas...");

  await runUpdateAppointments();

  cron.schedule("0 * * * *", async () => {
    await runUpdateAppointments();
  });
};

const runUpdateAppointments = async () => {
  console.log("[CRON] Ejecutando verificación de citas vencidas...");
  const now = new Date();
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

  try {
    const pendingAppointments = await Appointment.find({
      status: { $in: ["pendiente", "solicitada"] },
    }).populate("patient doctor");

    const appointmentsToCancel = pendingAppointments.filter((appt) => {
      const apptDate = new Date(appt.date);
      const deadline = new Date(apptDate);
      deadline.setDate(deadline.getDate() - 1);
      deadline.setHours(23, 59, 59, 999);
      return now > deadline;
    });

    const appointmentsToNoShow = await Appointment.find({
      status: "confirmada",
      date: { $lt: twoHoursAgo },
    }).populate("patient doctor");

    const operations = [];

    for (const appt of appointmentsToCancel) {
      operations.push({
        updateOne: {
          filter: { _id: appt._id },
          update: {
            $set: { status: "cancelada" },
            $push: {
              history: {
                action: "cancelada",
                date: now,
                updatedBy: SERVER_USER_ID,
              },
            },
          },
        },
      });

      await crearNotificacion({
        recipientId: appt.patient._id,
        title: "Cita Cancelada",
        message: "Tu cita fue cancelada por no ser confirmada a tiempo.",
        type: "cita",
      });

      await crearNotificacion({
        recipientId: appt.doctor._id,
        title: "Cita Cancelada",
        message: `La cita solicitada por el paciente ${appt.patient.username} fue cancelada automáticamente.`,
        type: "cita",
      });
    }

    for (const appt of appointmentsToNoShow) {
      operations.push({
        updateOne: {
          filter: { _id: appt._id },
          update: {
            $set: { status: "no asistió" },
            $push: {
              history: {
                action: "no asistió",
                date: now,
                updatedBy: SERVER_USER_ID,
              },
            },
          },
        },
      });

      await crearNotificacion({
        recipientId: appt.patient._id,
        title: "Cita Marcada como No Asistida",
        message: "Tu cita fue marcada como no asistida.",
        type: "cita",
      });

      await crearNotificacion({
        recipientId: appt.doctor._id,
        title: "Paciente No Asistió",
        message: `El paciente ${appt.patient.username} no asistió a la cita.`,
        type: "cita",
      });
    }

    if (operations.length > 0) {
      await Appointment.bulkWrite(operations);
      console.log(
        `[CRON] Actualización completada. Canceladas: ${appointmentsToCancel.length}, No asistió: ${appointmentsToNoShow.length}`
      );
    } else {
      console.log("[CRON] No se encontraron citas para actualizar");
    }
  } catch (error) {
    console.error("[CRON] Error al actualizar citas vencidas:", error.message);
  }
};
