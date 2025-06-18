import Users from "../models/user.model.js";
import ClinicalDetails from "../models/clinicalDetails.model.js";
import Treatment from "../models/treatment.model.js";
import Appointment from "../models/appointment.model.js";
import Alert from "../models/alert.model.js";

export const getDoctorMetrics = async (doctorId) => {
  const totalPacientes = await Users.countDocuments({
    role: "patient",
    doctor: doctorId,
  });

  const pacientesEnTratamiento = await Treatment.countDocuments({
    doctor: doctorId,
  });

  const hoy = new Date();
  const citasProximas = await Appointment.countDocuments({
    doctor: doctorId,
    date: { $gte: hoy },
    status: { $in: ["pendiente", "confirmada"] },
  });

  const alertasActivas = await Alert.countDocuments({
    doctor: doctorId,
    status: "activa",
  });

  const pacientesRiesgoAlto = await ClinicalDetails.countDocuments({
    doctor: doctorId,
    adherenceRisk: "alto",
  });

  const hace14Dias = new Date();
  hace14Dias.setDate(hoy.getDate() - 14);
  const pacientesSinActualizacion = await ClinicalDetails.countDocuments({
    doctor: doctorId,
    updatedAt: { $lte: hace14Dias },
  });

  const porcentajeTratamiento =
    totalPacientes > 0
      ? Math.round((pacientesEnTratamiento / totalPacientes) * 100)
      : 0;

  return {
    totalPacientes,
    pacientesEnTratamiento,
    porcentajeTratamiento,
    citasProximas,
    alertasActivas,
    pacientesRiesgoAlto,
    pacientesSinActualizacion,
  };
};

export const getAdminMetrics = async () => {
  const totalUsuarios = await Users.countDocuments();

  const totalDoctores = await Users.countDocuments({ role: "doctor" });
  const totalPacientes = await Users.countDocuments({ role: "patient" });

  const tratamientosTotales = await Treatment.countDocuments();
  const citasTotales = await Appointment.countDocuments();
  const alertasTotales = await Alert.countDocuments();

  const alertasActivas = await Alert.countDocuments({ status: "activa" });

  const porcentajeAlertasActivas =
    alertasTotales > 0
      ? Math.round((alertasActivas / alertasTotales) * 100)
      : 0;

  return {
    totalUsuarios,
    totalDoctores,
    totalPacientes,
    tratamientosTotales,
    citasTotales,
    alertasTotales,
    alertasActivas,
    porcentajeAlertasActivas,
  };
};
