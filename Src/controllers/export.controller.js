import PDFDocument from "pdfkit";
import ClinicalDetails from "../models/clinicalDetails.model.js";
import Users from "../models/user.model.js";
import Treatment from "../models/treatment.model.js";
import Appointment from "../models/appointment.model.js";
import Alert from "../models/alert.model.js";
import TreatmentHistory from "../models/treatmentHistory.model.js";
import { format } from "date-fns";
import ExcelJS from "exceljs";
import { Parser } from "json2csv";

export const exportClinicalDataPDF = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { patientId } = req.params;

    const patient = await Users.findOne({
      _id: patientId,
      role: "patient",
      doctor: doctorId,
    });

    if (!patient) {
      return res
        .status(404)
        .json({ message: "Paciente no encontrado o no autorizado." });
    }

    const [clinicalDetails, treatment, appointments, alerts, history] =
      await Promise.all([
        ClinicalDetails.findOne({ patient: patientId }),
        Treatment.findOne({ patient: patientId }),
        Appointment.find({ patient: patientId }).sort({ date: -1 }),
        Alert.find({ patient: patientId }).sort({ createdAt: -1 }),
        TreatmentHistory.find({ patient: patientId }).sort({ timestamp: -1 }),
      ]);

    if (
      !clinicalDetails &&
      !treatment &&
      appointments.length === 0 &&
      alerts.length === 0 &&
      history.length === 0
    ) {
      const doc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=paciente_${patientId}.pdf`
      );
      doc.pipe(res);

      doc
        .fontSize(20)
        .text("Reporte Clínico del Paciente", { align: "center" });
      doc.moveDown();
      doc.text("Este paciente no tiene información clínica registrada aún.");
      doc.end();
      return;
    }

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=paciente_${patientId}.pdf`
    );
    doc.pipe(res);

    doc.fontSize(20).text("Reporte Clínico del Paciente", { align: "center" });
    doc.moveDown();

    doc
      .fontSize(14)
      .text(`Nombre de usuario: ${patient.username || "No registrado"}`);
    doc.text(`Correo electrónico: ${patient.email || "No registrado"}`);
    doc.text(`Teléfono: ${patient.phone || "No registrado"}`);
    doc.text(`Registrado: ${format(patient.createdAt, "dd/MM/yyyy")}`);
    doc.moveDown();

    if (clinicalDetails) {
      doc.fontSize(16).text("Detalles Clínicos", { underline: true });
      doc.fontSize(12);
      doc.text(`Peso: ${clinicalDetails.weight || "N/A"} kg`);
      doc.text(`Altura: ${clinicalDetails.height || "N/A"} cm`);
      doc.text(`IMC: ${clinicalDetails.bmi || "N/A"}`);
      doc.text(
        `Fecha de diagnóstico: ${
          clinicalDetails.diagnosisDate
            ? format(clinicalDetails.diagnosisDate, "dd/MM/yyyy")
            : "N/A"
        }`
      );
      doc.text(
        `Estado bacteriológico: ${
          clinicalDetails.bacteriologicalStatus || "N/A"
        }`
      );
      doc.text(
        `Esquema de tratamiento: ${clinicalDetails.treatmentScheme || "N/A"}`
      );
      doc.text(`Fase: ${clinicalDetails.phase}`);
      doc.text(
        `Comorbilidades: ${
          clinicalDetails.comorbidities?.join(", ") || "Ninguna"
        }`
      );
      doc.text(`Estado VIH: ${clinicalDetails.hivStatus}`);
      doc.text(`Fumador: ${clinicalDetails.smoking ? "Sí" : "No"}`);
      doc.text(`Alcohol: ${clinicalDetails.alcoholUse ? "Sí" : "No"}`);
      doc.text(
        `Contacto con TBC: ${clinicalDetails.contactWithTb ? "Sí" : "No"}`
      );
      doc.text(
        `Tratamiento TBC previo: ${
          clinicalDetails.priorTbTreatment ? "Sí" : "No"
        }`
      );
      doc.text(
        `Síntomas: ${clinicalDetails.symptoms?.join(", ") || "Ninguno"}`
      );
      doc.text(`Notas clínicas: ${clinicalDetails.clinicalNotes || "N/A"}`);
      doc.moveDown();
    }

    if (treatment) {
      doc.fontSize(16).text("Tratamiento Actual", { underline: true });
      doc.fontSize(12);
      doc.text(`Inicio: ${format(treatment.startDate, "dd/MM/yyyy")}`);
      doc.text(
        `Fin: ${
          treatment.endDate
            ? format(treatment.endDate, "dd/MM/yyyy")
            : "No definido"
        }`
      );
      doc.text("Medicamentos:");
      treatment.medications.forEach((m) => {
        doc.text(`  • ${m.name} - ${m.dosage}, ${m.frequency}`);
      });
      doc.text(`Notas: ${treatment.notes || "N/A"}`);
      doc.moveDown();
    }

    if (history.length > 0) {
      doc.fontSize(16).text("Historial de Tratamientos", { underline: true });
      doc.fontSize(12);
      history.forEach((entry) => {
        doc.text(
          `Acción: ${entry.action} | Fecha: ${format(
            entry.timestamp,
            "dd/MM/yyyy"
          )}`
        );
        doc.text("Medicamentos:");
        entry.treatmentSnapshot.medications.forEach((m) => {
          doc.text(`  - ${m.name} - ${m.dose}, ${m.frequency}`);
        });
        doc.text(`Notas: ${entry.treatmentSnapshot.notes || "N/A"}`);
        doc.moveDown();
      });
    }

    if (appointments.length > 0) {
      doc.fontSize(16).text("Historial de Citas", { underline: true });
      doc.fontSize(12);
      appointments.forEach((appt) => {
        doc.text(
          `- ${format(appt.date, "dd/MM/yyyy")} | Estado: ${
            appt.status
          } | Motivo: ${appt.reason}`
        );
      });
      doc.moveDown();
    }

    if (alerts.length > 0) {
      doc.fontSize(16).text("Alertas Clínicas Generadas", {
        underline: true,
      });
      doc.fontSize(12);
      alerts.forEach((alert) => {
        doc.text(
          `- [${alert.severity}] ${alert.description} (${alert.status})`
        );
      });
      doc.moveDown();
    }

    doc.moveDown(2);
    doc.text(
      `Doctor responsable: Dr. ${req.user.username || "No identificado"}`
    );
    doc.text(`Fecha de generación: ${format(new Date(), "dd/MM/yyyy")}`);

    doc.end();
  } catch (error) {
    console.error("[Error] Error al generar PDF:", error);
    res.status(500).json({ message: "Error al generar el reporte clínico." });
  }
};

export const exportClinicalDataExcel = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { patientId } = req.params;

    const patient = await Users.findOne({
      _id: patientId,
      role: "patient",
      doctor: doctorId,
    });

    if (!patient) {
      return res
        .status(404)
        .json({ message: "Paciente no encontrado o no autorizado." });
    }

    const [clinicalDetails, treatment, appointments, alerts, history] =
      await Promise.all([
        ClinicalDetails.findOne({ patient: patientId }),
        Treatment.findOne({ patient: patientId }),
        Appointment.find({ patient: patientId }).sort({ date: -1 }),
        Alert.find({ patient: patientId }).sort({ createdAt: -1 }),
        TreatmentHistory.find({ patient: patientId }).sort({ timestamp: -1 }),
      ]);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Reporte Clínico");

    const addSection = (title) => {
      sheet.addRow([]);
      const row = sheet.addRow([title]);
      row.font = { bold: true, size: 14 };
    };

    addSection("Información del Paciente");
    sheet.addRow(["Nombre de usuario", patient.username || "No registrado"]);
    sheet.addRow(["Correo electrónico", patient.email || "No registrado"]);
    sheet.addRow(["Teléfono", patient.phone || "No registrado"]);
    sheet.addRow([
      "Registrado",
      format(new Date(patient.createdAt), "dd/MM/yyyy"),
    ]);

    if (clinicalDetails) {
      addSection("Detalles Clínicos");
      sheet.addRow(["Peso (kg)", clinicalDetails.weight ?? "N/A"]);
      sheet.addRow(["Altura (cm)", clinicalDetails.height ?? "N/A"]);
      sheet.addRow(["IMC", clinicalDetails.bmi ?? "N/A"]);
      sheet.addRow([
        "Fecha de diagnóstico",
        clinicalDetails.diagnosisDate
          ? format(clinicalDetails.diagnosisDate, "dd/MM/yyyy")
          : "N/A",
      ]);
      sheet.addRow([
        "Estado bacteriológico",
        clinicalDetails.bacteriologicalStatus || "N/A",
      ]);
      sheet.addRow([
        "Esquema de tratamiento",
        clinicalDetails.treatmentScheme || "N/A",
      ]);
      sheet.addRow(["Fase", clinicalDetails.phase || "N/A"]);
      sheet.addRow([
        "Comorbilidades",
        clinicalDetails.comorbidities?.join(", ") || "Ninguna",
      ]);
      sheet.addRow(["Estado VIH", clinicalDetails.hivStatus || "N/A"]);
      sheet.addRow(["Fumador", clinicalDetails.smoking ? "Sí" : "No"]);
      sheet.addRow(["Alcohol", clinicalDetails.alcoholUse ? "Sí" : "No"]);
      sheet.addRow([
        "Contacto con TBC",
        clinicalDetails.contactWithTb ? "Sí" : "No",
      ]);
      sheet.addRow([
        "Tratamiento TBC previo",
        clinicalDetails.priorTbTreatment ? "Sí" : "No",
      ]);
      sheet.addRow([
        "Síntomas",
        clinicalDetails.symptoms?.join(", ") || "Ninguno",
      ]);
      sheet.addRow(["Notas clínicas", clinicalDetails.clinicalNotes || "N/A"]);
    }

    if (treatment) {
      addSection("Tratamiento Actual");
      sheet.addRow([
        "Inicio",
        format(new Date(treatment.startDate), "dd/MM/yyyy"),
      ]);
      sheet.addRow([
        "Fin",
        treatment.endDate
          ? format(new Date(treatment.endDate), "dd/MM/yyyy")
          : "No definido",
      ]);
      sheet.addRow(["Medicamentos"]);
      treatment.medications?.forEach((m) => {
        sheet.addRow([m.name, m.dosage, m.frequency]);
      });
      sheet.addRow(["Notas", treatment.notes || "N/A"]);
    }

    if (history.length > 0) {
      addSection("Historial de Tratamientos");
      history.forEach((entry) => {
        sheet.addRow([
          "Acción",
          entry.action,
          "Fecha",
          format(new Date(entry.timestamp), "dd/MM/yyyy"),
        ]);
        sheet.addRow(["Medicamentos"]);
        entry.treatmentSnapshot?.medications?.forEach((m) => {
          sheet.addRow([m.name, m.dose, m.frequency]);
        });
        sheet.addRow([
          "Notas",
          entry.treatmentSnapshot?.notes || "Sin notas registradas",
        ]);
      });
    }

    if (appointments.length > 0) {
      addSection("Historial de Citas");
      sheet.addRow(["Fecha", "Estado", "Motivo"]);
      appointments.forEach((appt) => {
        sheet.addRow([
          format(new Date(appt.date), "dd/MM/yyyy"),
          appt.status,
          appt.reason,
        ]);
      });
    }

    if (alerts.length > 0) {
      addSection("Alertas Clínicas Generadas");
      sheet.addRow(["Descripción", "Severidad", "Estado"]);
      alerts.forEach((alert) => {
        sheet.addRow([alert.description, alert.severity, alert.status]);
      });
    }

    addSection("Generación del Reporte");
    sheet.addRow([
      "Doctor responsable",
      req.user.username || "No identificado",
    ]);
    sheet.addRow(["Fecha de generación", format(new Date(), "dd/MM/yyyy")]);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=paciente_${patientId}.xlsx`
    );
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("[Error] Error al generar Excel:", error);
    res.status(500).json({ message: "Error al generar el archivo Excel." });
  }
};

export const exportClinicalDataCSV = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { patientId } = req.params;

    const patient = await Users.findOne({
      _id: patientId,
      role: "patient",
      doctor: doctorId,
    });

    if (!patient) {
      return res
        .status(404)
        .json({ message: "Paciente no encontrado o no autorizado." });
    }

    const [clinicalDetails, treatment, appointments, alerts, history] =
      await Promise.all([
        ClinicalDetails.findOne({ patient: patientId }),
        Treatment.findOne({ patient: patientId }),
        Appointment.find({ patient: patientId }).sort({ date: -1 }),
        Alert.find({ patient: patientId }).sort({ createdAt: -1 }),
        TreatmentHistory.find({ patient: patientId }).sort({ timestamp: -1 }),
      ]);

    const data = [];

    data.push({
      Sección: "Paciente",
      Campo: "Nombre de usuario",
      Valor: patient.username || "No registrado",
    });
    data.push({
      Sección: "Paciente",
      Campo: "Correo electrónico",
      Valor: patient.email || "No registrado",
    });
    data.push({
      Sección: "Paciente",
      Campo: "Teléfono",
      Valor: patient.phone || "No registrado",
    });
    data.push({
      Sección: "Paciente",
      Campo: "Registrado",
      Valor: format(patient.createdAt, "dd/MM/yyyy"),
    });

    if (clinicalDetails) {
      data.push({
        Sección: "Detalles Clínicos",
        Campo: "Peso",
        Valor: clinicalDetails.weight || "N/A",
      });
      data.push({
        Sección: "Detalles Clínicos",
        Campo: "Altura",
        Valor: clinicalDetails.height || "N/A",
      });
      data.push({
        Sección: "Detalles Clínicos",
        Campo: "IMC",
        Valor: clinicalDetails.bmi || "N/A",
      });
      data.push({
        Sección: "Detalles Clínicos",
        Campo: "Fecha de diagnóstico",
        Valor: clinicalDetails.diagnosisDate
          ? format(clinicalDetails.diagnosisDate, "dd/MM/yyyy")
          : "N/A",
      });
      data.push({
        Sección: "Detalles Clínicos",
        Campo: "Estado bacteriológico",
        Valor: clinicalDetails.bacteriologicalStatus || "N/A",
      });
      data.push({
        Sección: "Detalles Clínicos",
        Campo: "Esquema de tratamiento",
        Valor: clinicalDetails.treatmentScheme || "N/A",
      });
      data.push({
        Sección: "Detalles Clínicos",
        Campo: "Fase",
        Valor: clinicalDetails.phase || "N/A",
      });
      data.push({
        Sección: "Detalles Clínicos",
        Campo: "Comorbilidades",
        Valor: clinicalDetails.comorbidities?.join(", ") || "Ninguna",
      });
      data.push({
        Sección: "Detalles Clínicos",
        Campo: "Estado VIH",
        Valor: clinicalDetails.hivStatus,
      });
      data.push({
        Sección: "Detalles Clínicos",
        Campo: "Fumador",
        Valor: clinicalDetails.smoking ? "Sí" : "No",
      });
      data.push({
        Sección: "Detalles Clínicos",
        Campo: "Alcohol",
        Valor: clinicalDetails.alcoholUse ? "Sí" : "No",
      });
      data.push({
        Sección: "Detalles Clínicos",
        Campo: "Contacto con TBC",
        Valor: clinicalDetails.contactWithTb ? "Sí" : "No",
      });
      data.push({
        Sección: "Detalles Clínicos",
        Campo: "Tratamiento TBC previo",
        Valor: clinicalDetails.priorTbTreatment ? "Sí" : "No",
      });
      data.push({
        Sección: "Detalles Clínicos",
        Campo: "Síntomas",
        Valor: clinicalDetails.symptoms?.join(", ") || "Ninguno",
      });
      data.push({
        Sección: "Detalles Clínicos",
        Campo: "Notas clínicas",
        Valor: clinicalDetails.clinicalNotes || "N/A",
      });
    }

    if (treatment) {
      data.push({
        Sección: "Tratamiento Actual",
        Campo: "Inicio",
        Valor: format(treatment.startDate, "dd/MM/yyyy"),
      });
      data.push({
        Sección: "Tratamiento Actual",
        Campo: "Fin",
        Valor: treatment.endDate
          ? format(treatment.endDate, "dd/MM/yyyy")
          : "No definido",
      });
      treatment.medications.forEach((m, i) => {
        data.push({
          Sección: "Tratamiento Actual",
          Campo: `Medicamento ${i + 1}`,
          Valor: `${m.name} - ${m.dosage}, ${m.frequency}`,
        });
      });
      data.push({
        Sección: "Tratamiento Actual",
        Campo: "Notas",
        Valor: treatment.notes || "N/A",
      });
    }

    if (history.length > 0) {
      history.forEach((entry, i) => {
        data.push({
          Sección: `Historial de Tratamientos ${i + 1}`,
          Campo: "Acción",
          Valor: `${entry.action} - ${format(entry.timestamp, "dd/MM/yyyy")}`,
        });
        entry.treatmentSnapshot.medications.forEach((m, j) => {
          data.push({
            Sección: `Historial de Tratamientos ${i + 1}`,
            Campo: `Medicamento ${j + 1}`,
            Valor: `${m.name} - ${m.dose}, ${m.frequency}`,
          });
        });
        data.push({
          Sección: `Historial de Tratamientos ${i + 1}`,
          Campo: "Notas",
          Valor: entry.treatmentSnapshot.notes || "N/A",
        });
      });
    }

    if (appointments.length > 0) {
      appointments.forEach((appt, i) => {
        data.push({
          Sección: `Cita ${i + 1}`,
          Campo: "Fecha",
          Valor: format(appt.date, "dd/MM/yyyy"),
        });
        data.push({
          Sección: `Cita ${i + 1}`,
          Campo: "Estado",
          Valor: appt.status,
        });
        data.push({
          Sección: `Cita ${i + 1}`,
          Campo: "Motivo",
          Valor: appt.reason,
        });
      });
    }

    if (alerts.length > 0) {
      alerts.forEach((alert, i) => {
        data.push({
          Sección: `Alerta ${i + 1}`,
          Campo: "Descripción",
          Valor: alert.description,
        });
        data.push({
          Sección: `Alerta ${i + 1}`,
          Campo: "Severidad",
          Valor: alert.severity,
        });
        data.push({
          Sección: `Alerta ${i + 1}`,
          Campo: "Estado",
          Valor: alert.status,
        });
      });
    }

    data.push({
      Sección: "Generación del Reporte",
      Campo: "Doctor responsable",
      Valor: req.user.username || "No identificado",
    });
    data.push({
      Sección: "Generación del Reporte",
      Campo: "Fecha de generación",
      Valor: format(new Date(), "dd/MM/yyyy"),
    });

    const parser = new Parser({ fields: ["Sección", "Campo", "Valor"] });
    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment(`paciente_${patientId}.csv`);
    return res.send(csv);
  } catch (error) {
    console.error("[Error] Error al generar CSV:", error);
    res.status(500).json({ message: "Error al generar el archivo CSV." });
  }
};


