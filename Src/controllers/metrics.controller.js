import {
  getDoctorMetrics,
  getAdminMetrics,
} from "../services/metrics.service.js";
import PDFDocument from "pdfkit";
import { Parser } from "json2csv";
import ExcelJS from "exceljs";

export const getMetricsForDoctor = async (req, res) => {
  try {
    const doctorId = req.user._id;

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

export const exportDoctorMetricsPDF = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const metrics = await getDoctorMetrics(doctorId);

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=doctor_metrics.pdf"
    );

    doc.pipe(res);

    doc.fontSize(20).text("Métricas del Doctor", { align: "center" });
    doc.moveDown();

    doc
      .fontSize(12)
      .text(`Total de pacientes asignados: ${metrics.totalPacientes}`);
    doc.text(`Pacientes en tratamiento: ${metrics.pacientesEnTratamiento}`);
    doc.text(`Porcentaje en tratamiento: ${metrics.porcentajeTratamiento}%`);
    doc.text(`Citas próximas: ${metrics.citasProximas}`);
    doc.text(`Alertas activas: ${metrics.alertasActivas}`);
    doc.text(
      `Pacientes con riesgo de adherencia alto: ${metrics.pacientesRiesgoAlto}`
    );
    doc.text(
      `Pacientes sin actualización clínica (últimos 14 días): ${metrics.pacientesSinActualizacion}`
    );

    doc.end();
  } catch (error) {
    res.status(500).json({
      message: "Error al exportar métricas en PDF",
      error: error.message,
    });
  }
};

export const exportAdminMetricsExcel = async (req, res) => {
  try {
    const metrics = await getAdminMetrics();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Métricas Administrativas");

    worksheet.columns = [
      { header: "Métrica", key: "key" },
      { header: "Valor", key: "value" },
    ];

    Object.entries(metrics).forEach(([key, value]) => {
      worksheet.addRow({ key, value });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=admin_metrics.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al exportar métricas en Excel",
        error: error.message,
      });
  }
};

export const exportAdminMetricsCSV = async (req, res) => {
  try {
    const metrics = await getAdminMetrics();

    const data = Object.entries(metrics).map(([key, value]) => ({
      key,
      value,
    }));
    const parser = new Parser({ fields: ["key", "value"] });
    const csv = parser.parse(data);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=admin_metrics.csv"
    );
    res.status(200).end(csv);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al exportar métricas en CSV",
        error: error.message,
      });
  }
};
