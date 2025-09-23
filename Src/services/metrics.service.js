import mongoose from "mongoose";
import Users from "../models/user.model.js";
import ClinicalDetails from "../models/clinicalDetails.model.js";
import Treatment from "../models/treatment.model.js";
import TreatmentHistory from "../models/treatmentHistory.model.js";
import Appointment from "../models/appointment.model.js";
import Alert from "../models/alert.model.js";
import EducationalContent from "../models/educationalContent.model.js";
import EducationalHistory from "../models/educationalHistory.model.js";

export const getDoctorMetrics = async (doctorId) => {
  const doctorObjectId = new mongoose.Types.ObjectId(doctorId);

  const pacientesConRegistro = await Users.find({
    role: "patient",
    doctor: doctorObjectId,
    registrationToken: { $exists: false },
  }).distinct("_id");

  const pacientesPendientes = await Users.countDocuments({
    role: "patient",
    doctor: doctorObjectId,
    registrationToken: { $exists: true },
  });

  const pacientesAsignados = pacientesConRegistro.length;

  const pacientesEnTratamiento = await Treatment.countDocuments({
    patient: { $in: pacientesConRegistro },
  });

  const riesgosAgg = await ClinicalDetails.aggregate([
    { $match: { patient: { $in: pacientesConRegistro } } },
    { $group: { _id: "$adherenceRisk", count: { $sum: 1 } } },
  ]);
  const riesgo = { bajo: 0, medio: 0, alto: 0 };
  riesgosAgg.forEach((r) => {
    if (r._id) riesgo[r._id] = r.count;
  });

  const fasesAgg = await ClinicalDetails.aggregate([
    { $match: { patient: { $in: pacientesConRegistro } } },
    { $group: { _id: "$phase", count: { $sum: 1 } } },
  ]);
  const faseTratamiento = { inicio: 0, intermedio: 0, final: 0 };
  fasesAgg.forEach((f) => {
    if (f._id) faseTratamiento[f._id] = f.count;
  });

  const hoy = new Date();
  const citasProximas = await Appointment.countDocuments({
    doctor: doctorObjectId,
    date: { $gte: hoy },
    status: { $in: ["confirmada"] },
  });

  const citasEstadoAgg = await Appointment.aggregate([
    { $match: { doctor: doctorObjectId } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  const porEstado = {
    pendiente: 0,
    confirmada: 0,
    asistió: 0,
    cancelada: 0,
    "no asistió": 0,
    solicitada: 0,
  };
  citasEstadoAgg.forEach((c) => {
    if (c._id) porEstado[c._id] = c.count;
  });

  const citasMensualesAgg = await Appointment.aggregate([
    { $match: { doctor: doctorObjectId } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
        cantidad: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  const historialMensual = citasMensualesAgg.map((c) => ({
    mes: c._id,
    cantidad: c.cantidad,
  }));

  const tratamientosActivos = await Treatment.countDocuments({
    patient: { $in: pacientesConRegistro },
    doctor: doctorObjectId,
  });

  const tratamientosFinalizados = await TreatmentHistory.countDocuments({
    patient: { $in: pacientesConRegistro },
    doctor: doctorObjectId,
    action: "finished",
  });

  const tratamientosMensualesAgg = await TreatmentHistory.aggregate([
    {
      $match: {
        patient: { $in: pacientesConRegistro },
        doctor: doctorObjectId,
      },
    },
    { $sort: { _id: 1 } },
    {
      $group: {
        _id: "$treatment",
        lastSnapshot: { $last: "$treatmentSnapshot" },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m",
            date: "$lastSnapshot.startDate",
          },
        },
        cantidad: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);


  const nuevosPorMes = tratamientosMensualesAgg.map((t) => ({
    mes: t._id,
    cantidad: t.cantidad,
  }));

  const alertasActivas = await Alert.countDocuments({
    doctor: doctorObjectId,
    status: "activa",
  });
  const alertasResueltas = await Alert.countDocuments({
    doctor: doctorObjectId,
    status: "resuelta",
  });
  const alertasSeveridadAgg = await Alert.aggregate([
    { $match: { doctor: doctorObjectId } },
    { $group: { _id: "$severity", count: { $sum: 1 } } },
  ]);
  const porSeveridad = { baja: 0, media: 0, alta: 0 };
  alertasSeveridadAgg.forEach((a) => {
    if (a._id) porSeveridad[a._id] = a.count;
  });

  const contenidosAsignados = await EducationalContent.countDocuments({
    uploadBy: doctorObjectId,
  });
  const vistos = await EducationalHistory.countDocuments({
    patient: { $in: pacientesConRegistro },
  });
  const completados = await EducationalHistory.countDocuments({
    patient: { $in: pacientesConRegistro },
    completed: true,
  });

  return {
    pacientes: {
      asignados: pacientesAsignados,
      pendientesRegistro: pacientesPendientes,
      enTratamiento: pacientesEnTratamiento,
      riesgo,
      faseTratamiento,
    },
    citas: {
      proximas: citasProximas,
      porEstado,
      historialMensual,
    },
    tratamientos: {
      activos: tratamientosActivos,
      finalizados: tratamientosFinalizados,
      nuevosPorMes,
    },
    alertas: {
      activas: alertasActivas,
      resueltas: alertasResueltas,
      porSeveridad,
    },
    educacion: {
      contenidosAsignados,
      vistos,
      completados,
    },
  };
};

export const getAdminMetrics = async () => {
  const totalUsuarios = await Users.countDocuments();
  const totalPendientes = await Users.countDocuments({
    registrationToken: { $exists: true },
  });

  const totalDoctores = await Users.countDocuments({
    role: "doctor",
    registrationToken: { $exists: false },
  });
  const totalPacientes = await Users.countDocuments({
    role: "patient",
    registrationToken: { $exists: false },
  });

  const activos = await Users.countDocuments({
    isActive: true,
    registrationToken: { $exists: false },
  });
  const inactivos = totalUsuarios - activos;

  const citasTotales = await Appointment.countDocuments();
  const citasEstadoAgg = await Appointment.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  const citasPorEstado = {
    pendiente: 0,
    confirmada: 0,
    asistió: 0,
    "no asistió": 0,
    cancelada: 0,
    solicitada: 0,
  };
  citasEstadoAgg.forEach((c) => {
    if (c._id) citasPorEstado[c._id] = c.count;
  });

  const citasMensualesAgg = await Appointment.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
        cantidad: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  const evolucionMensual = citasMensualesAgg.map((c) => ({
    mes: c._id,
    cantidad: c.cantidad,
  }));

  const tratamientosActivos = await Treatment.countDocuments();
  const tratamientosFinalizadosAgg = await TreatmentHistory.aggregate([
    { $match: { action: "finished" } },
    { $group: { _id: "$treatment" } },
    { $count: "total" },
  ]);
  const tratamientosFinalizados = tratamientosFinalizadosAgg[0]?.total || 0;

  const tratamientosEliminadosAgg = await TreatmentHistory.aggregate([
    { $match: { action: "delete" } },
    { $group: { _id: "$treatment" } },
    { $count: "total" },
  ]);
  const tratamientosEliminados = tratamientosEliminadosAgg[0]?.total || 0;

  const tratamientosTotales =
    tratamientosActivos + tratamientosFinalizados + tratamientosEliminados;

  const tratamientosMensualesAgg = await TreatmentHistory.aggregate([
    { $sort: { _id: 1 } },
    {
      $group: {
        _id: "$treatment",
        lastSnapshot: { $last: "$treatmentSnapshot" },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m", date: "$lastSnapshot.startDate" },
        },
        nuevos: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const evolucionTratamientos = tratamientosMensualesAgg.map((t) => ({
    mes: t._id,
    nuevos: t.nuevos,
  }));

  const alertasTotales = await Alert.countDocuments();
  const alertasActivas = await Alert.countDocuments({ status: "activa" });
  const alertasResueltas = await Alert.countDocuments({ status: "resuelta" });
  const alertasRevisadas = await Alert.countDocuments({ status: "revisada" });
  const alertasPorTipoAgg = await Alert.aggregate([
    { $group: { _id: "$type", count: { $sum: 1 } } },
  ]);
  const porTipo = {
    baja_adherencia: 0,
    riesgo_abandono: 0,
    tratamiento_inefectivo: 0,
    resistencia_medicamentosa: 0,
    inactividad_prolongada: 0,
    falta_educacion: 0,
  };
  alertasPorTipoAgg.forEach((a) => {
    if (a._id) porTipo[a._id] = a.count;
  });

  const alertasSeveridadAgg = await Alert.aggregate([
    { $group: { _id: "$severity", count: { $sum: 1 } } },
  ]);
  const porSeveridad = { baja: 0, media: 0, alta: 0 };
  alertasSeveridadAgg.forEach((a) => {
    if (a._id) porSeveridad[a._id] = a.count;
  });

  const contenidos = await EducationalContent.countDocuments();
  const vistos = await EducationalHistory.countDocuments();
  const completados = await EducationalHistory.countDocuments({
    completed: true,
  });
  const topContenidosRaw = await EducationalHistory.aggregate([
    { $group: { _id: "$content", vistas: { $sum: 1 } } },
    { $sort: { vistas: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "educationalcontents",
        localField: "_id",
        foreignField: "_id",
        as: "contentInfo",
      },
    },
    { $unwind: "$contentInfo" },
    { $project: { titulo: "$contentInfo.title", vistas: 1 } },
  ]);
  const topContenidos = topContenidosRaw.map((c) => ({
    titulo: c.titulo,
    vistas: c.vistas,
  }));

  return {
    usuarios: {
      total: totalUsuarios - 2,
      pendientesRegistro: totalPendientes,
      doctores: totalDoctores,
      pacientes: totalPacientes,
      activos: activos - 2,
      inactivos,
    },
    citas: {
      totales: citasTotales,
      porEstado: citasPorEstado,
      evolucionMensual,
    },
    tratamientos: {
      activos: tratamientosActivos,
      finalizados: tratamientosFinalizados,
      eliminados: tratamientosEliminados,
      totales: tratamientosTotales,
      evolucionMensual: evolucionTratamientos,
    },
    alertas: {
      totales: alertasTotales,
      activas: alertasActivas,
      resueltas: alertasResueltas,
      revisadas: alertasRevisadas,
      porTipo,
      porSeveridad,
    },
    educacion: {
      contenidos,
      vistos,
      completados,
      topContenidos,
    },
  };
};
