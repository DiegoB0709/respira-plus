import {
  getDoctorMetrics,
  getAdminMetrics,
} from "../services/metrics.service.js";

export const getMetricsForDoctor = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const metrics = await getDoctorMetrics(doctorId);

    res.status(200).json({
      ok: true,
      metrics,
    });
  } catch (error) {
    console.error("[Error] Error al obtener métricas del doctor:", error);
    res.status(500).json({
      ok: false,
      message: "Error al obtener las métricas del doctor",
    });
  }
};

export const getMetricsForAdmin = async (req, res) => {
  try {
    const metrics = await getAdminMetrics();

    res.status(200).json({
      ok: true,
      metrics,
    });
  } catch (error) {
    console.error("[Error] Error al obtener métricas administrativas:", error);
    res.status(500).json({
      ok: false,
      message: "Error al obtener las métricas administrativas",
    });
  }
};