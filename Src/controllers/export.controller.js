import PDFDocument from "pdfkit";
import { format } from "date-fns";
import ExcelJS from "exceljs";
import { Parser } from "json2csv";
import { evaluatePatient } from "../services/ai.service.js";
import { getPatientData } from "../services/getPatientData.service.js";

export const exportClinicalDataPDF = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { patientId } = req.params;

    const data = await getPatientData(doctorId, patientId);
    if (!data) {
      return res
        .status(404)
        .json({ message: "Paciente no encontrado o no autorizado." });
    }

    const {
      patient,
      clinicalDetails,
      treatment,
      appointments,
      alerts,
      history,
      clinicalHistory,
    } = data;

    if (
      !clinicalDetails &&
      !treatment &&
      appointments.length === 0 &&
      alerts.length === 0 &&
      history.length === 0 &&
      clinicalHistory.length === 0
    ) {
      const doc = new PDFDocument({ margin: 50 });
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
      doc.moveDown(2);
      doc
        .fontSize(10)
        .text(`Doctor responsable: Dr. ${req.user.username || "No definido"}`, {
          align: "left",
        });
      doc.text(`Fecha de generación: ${format(new Date(), "dd/MM/yyyy")}`, {
        align: "left",
      });
      doc.end();
      return;
    }

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=paciente_${patientId}.pdf`
    );
    doc.pipe(res);

    const standardEmpty = "No definido";

    doc.fontSize(20).text("Reporte Clínico del Paciente", { align: "center" });
    doc.moveDown(2);

    doc
      .fontSize(14)
      .text(`Nombre de usuario: ${patient.username || standardEmpty}`);
    doc.text(`Correo electrónico: ${patient.email || standardEmpty}`);
    doc.text(`Teléfono: ${patient.phone || standardEmpty}`);
    doc.text(`Registrado: ${format(patient.createdAt, "dd/MM/yyyy")}`);
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

    if (clinicalDetails) {
      doc.moveDown();
      doc.fontSize(16).text("Detalles Clínicos", { underline: true });
      doc.moveDown();
      doc.fontSize(12);
      doc.text(`Peso: ${clinicalDetails.weight || standardEmpty} kg`);
      doc.text(`Altura: ${clinicalDetails.height || standardEmpty} cm`);
      doc.text(`IMC: ${clinicalDetails.bmi || standardEmpty}`);
      doc.text(
        `Fecha de diagnóstico: ${
          clinicalDetails.diagnosisDate
            ? format(clinicalDetails.diagnosisDate, "dd/MM/yyyy")
            : standardEmpty
        }`
      );
      doc.text(
        `Estado bacteriológico: ${
          clinicalDetails.bacteriologicalStatus || standardEmpty
        }`
      );
      doc.text(
        `Esquema de tratamiento: ${
          clinicalDetails.treatmentScheme || standardEmpty
        }`
      );
      doc.text(`Fase: ${clinicalDetails.phase || standardEmpty}`);
      doc.text(
        `Comorbilidades: ${
          clinicalDetails.comorbidities?.join(", ") || standardEmpty
        }`
      );
      doc.text(`Estado VIH: ${clinicalDetails.hivStatus || standardEmpty}`);
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
        `Síntomas: ${clinicalDetails.symptoms?.join(", ") || standardEmpty}`
      );
      doc.text(
        `Notas clínicas: ${clinicalDetails.clinicalNotes || standardEmpty}`
      );
    }

    if (treatment) {
      doc.moveDown();
      doc.fontSize(16).text("Tratamiento Actual", { underline: true });
      doc.moveDown();
      doc.fontSize(12);
      doc.text(`Inicio: ${format(treatment.startDate, "dd/MM/yyyy")}`);
      doc.text(
        `Fin: ${
          treatment.endDate
            ? format(treatment.endDate, "dd/MM/yyyy")
            : standardEmpty
        }`
      );
      doc.text("Medicamentos:");
      treatment.medications.forEach((m) => {
        doc.text(`  • ${m.name} - ${m.dosage}, ${m.frequency}`);
      });
      doc.text(`Notas: ${treatment.notes || standardEmpty}`);
    }

    if (history.length > 0) {
      doc.addPage();
      doc.fontSize(16).text("Historial de Tratamientos", { underline: true });
      doc.moveDown();
      doc.fontSize(12);
      history.forEach((group) => {
        doc.text(`Tratamiento ID: ${group.treatmentId}`);
        group.changes.forEach((entry) => {
          doc.text(
            `Acción: ${entry.action} | Fecha: ${format(
              entry.timestamp,
              "dd/MM/yyyy"
            )}`
          );
          doc.text("Medicamentos:");
          entry.treatmentSnapshot.medications.forEach((m) => {
            doc.text(`  - ${m.name} - ${m.dosage}, ${m.frequency}`);
          });
          doc.text(`Notas: ${entry.treatmentSnapshot.notes || standardEmpty}`);
          doc.moveDown();
        });
        doc
          .moveTo(70, doc.y)
          .lineTo(530, doc.y)
          .dash(2, { space: 2 })
          .stroke()
          .undash();
        doc.moveDown();
      });
    }

    if (clinicalHistory.length > 0) {
      doc.addPage();
      doc.fontSize(16).text("Historial Clínico", { underline: true });
      doc.moveDown();
      doc.fontSize(12);
      clinicalHistory.forEach((ch) => {
        doc.text(`Fecha: ${format(ch.snapshotDate, "dd/MM/yyyy")}`);
        doc.text(`Peso: ${ch.weight || standardEmpty} kg`);
        doc.text(`IMC: ${ch.bmi || standardEmpty}`);
        doc.text(`Síntomas: ${ch.symptoms?.join(", ") || standardEmpty}`);
        doc.text(`Notas: ${ch.clinicalNotes || standardEmpty}`);
        doc.text(`Fase: ${ch.phase || standardEmpty}`);
        doc.text(
          `Estado bacteriológico: ${ch.bacteriologicalStatus || standardEmpty}`
        );
        doc.text(
          `Comorbilidades: ${ch.comorbidities?.join(", ") || standardEmpty}`
        );
        doc.text(`Estado VIH: ${ch.hivStatus || standardEmpty}`);
        doc.text(`Fumador: ${ch.smoking ? "Sí" : "No"}`);
        doc.text(`Alcohol: ${ch.alcoholUse ? "Sí" : "No"}`);
        doc.text(`Contacto con TBC: ${ch.contactWithTb ? "Sí" : "No"}`);
        doc.text(
          `Tratamiento TBC previo: ${ch.priorTbTreatment ? "Sí" : "No"}`
        );
        doc.text(`Riesgo de adherencia: ${ch.adherenceRisk || standardEmpty}`);
        doc.moveDown();
      });
    }

    if (appointments.length > 0) {
      doc.addPage();
      doc.fontSize(16).text("Historial de Citas", { underline: true });
      doc.moveDown();
      doc.fontSize(12);
      appointments.forEach((appt) => {
        doc.text(
          `- ${format(appt.date, "dd/MM/yyyy")} | Estado: ${
            appt.status
          } | Motivo: ${appt.reason}`
        );
      });
    }

    if (alerts.length > 0) {
      doc.addPage();
      doc.fontSize(16).text("Alertas Clínicas Generadas", { underline: true });
      doc.moveDown();
      doc.fontSize(12);
      alerts.forEach((alert) => {
        doc.text(
          `- [${alert.severity}] ${alert.description} (${alert.status})`
        );
      });
    }

    const evaluation = await evaluatePatient(patientId);
    if (evaluation) {
      doc.moveDown();
      doc.fontSize(16).text("Evaluación del Paciente", { underline: true });
      doc.moveDown();
      doc.fontSize(12);
      doc.text(`Nivel de adherencia: ${evaluation.adherenceLevel}`);
      doc.text(`Riesgo de abandono: ${evaluation.dropoutRisk}`);
      doc.text(
        `Bandera - Abandono: ${evaluation.flags.abandono ? "Sí" : "No"}`
      );
      doc.text(
        `Bandera - Resistencia: ${evaluation.flags.resistencia ? "Sí" : "No"}`
      );
      doc.moveDown();
      if (evaluation.recommendations.length > 0) {
        doc.text("Recomendaciones:");
        evaluation.recommendations.forEach((rec) => {
          doc.text(`- ${rec}`);
        });
      }
      if (evaluation.triggeredRules.length > 0) {
        doc.text("Reglas activadas:");
        evaluation.triggeredRules.forEach((rule) => {
          doc.text(`- ${rule}`);
        });
      }
    }

    doc.moveDown();
    doc
      .fontSize(10)
      .text(`Doctor responsable: Dr. ${req.user.username || standardEmpty}`, {
        align: "left",
      });
    doc.text(`Fecha de generación: ${format(new Date(), "dd/MM/yyyy")}`, {
      align: "left",
    });
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

    const data = await getPatientData(doctorId, patientId);
    if (!data) {
      return res
        .status(404)
        .json({ message: "Paciente no encontrado o no autorizado." });
    }

    const {
      patient,
      clinicalDetails,
      treatment,
      appointments,
      alerts,
      history,
      clinicalHistory,
    } = data;

    const evaluation = await evaluatePatient(patientId);

    const workbook = new ExcelJS.Workbook();

    const addHeaderStyle = (sheet, row) => {
      row.font = { bold: true };
      row.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD9E1F2" },
      };
    };

    const addIdStyle = (row) => {
      row.font = { bold: true };
      row.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE2EFDA" },
      };
    };

    const formatDate = (date) =>
      date
        ? format(new Date(date), "dd/MM/yyyy")
        : "Sin información registrada";

    const sheet1 = workbook.addWorksheet("Información General del Paciente");
    sheet1.columns = [
      { header: "Campo", key: "campo", width: 30 },
      { header: "Valor", key: "valor", width: 50 },
    ];
    sheet1.getRow(1).font = { bold: true };
    sheet1.views = [{ state: "frozen", ySplit: 1 }];
    sheet1.addRow({
      campo: "Nombre de usuario",
      valor: patient.username || "Sin información registrada",
    });
    sheet1.addRow({
      campo: "Correo electrónico",
      valor: patient.email || "Sin información registrada",
    });
    sheet1.addRow({
      campo: "Teléfono",
      valor: patient.phone || "Sin información registrada",
    });
    sheet1.addRow({
      campo: "Registrado",
      valor: formatDate(patient.createdAt),
    });

    const sheet2 = workbook.addWorksheet("Detalles Clínicos");
    sheet2.columns = [
      { header: "Campo", key: "campo", width: 30 },
      { header: "Valor", key: "valor", width: 50 },
    ];
    sheet2.getRow(1).font = { bold: true };
    sheet2.views = [{ state: "frozen", ySplit: 1 }];
    if (clinicalDetails) {
      sheet2.addRow({
        campo: "Peso (kg)",
        valor: clinicalDetails.weight ?? "Sin información registrada",
      });
      sheet2.addRow({
        campo: "Altura (cm)",
        valor: clinicalDetails.height ?? "Sin información registrada",
      });
      sheet2.addRow({
        campo: "IMC",
        valor: clinicalDetails.bmi ?? "Sin información registrada",
      });
      sheet2.addRow({
        campo: "Fecha de diagnóstico",
        valor: formatDate(clinicalDetails.diagnosisDate),
      });
      sheet2.addRow({
        campo: "Estado bacteriológico",
        valor:
          clinicalDetails.bacteriologicalStatus || "Sin información registrada",
      });
      sheet2.addRow({
        campo: "Esquema de tratamiento",
        valor: clinicalDetails.treatmentScheme || "Sin información registrada",
      });
      sheet2.addRow({
        campo: "Fase",
        valor: clinicalDetails.phase || "Sin información registrada",
      });
      sheet2.addRow({
        campo: "Comorbilidades",
        valor: clinicalDetails.comorbidities?.join(", ") || "Ninguna",
      });
      sheet2.addRow({
        campo: "Estado VIH",
        valor: clinicalDetails.hivStatus || "Sin información registrada",
      });
      sheet2.addRow({
        campo: "Fumador",
        valor: clinicalDetails.smoking ? "Sí" : "No",
      });
      sheet2.addRow({
        campo: "Alcohol",
        valor: clinicalDetails.alcoholUse ? "Sí" : "No",
      });
      sheet2.addRow({
        campo: "Contacto con TBC",
        valor: clinicalDetails.contactWithTb ? "Sí" : "No",
      });
      sheet2.addRow({
        campo: "Tratamiento TBC previo",
        valor: clinicalDetails.priorTbTreatment ? "Sí" : "No",
      });
      sheet2.addRow({
        campo: "Síntomas",
        valor: clinicalDetails.symptoms?.join(", ") || "Ninguno",
      });
      sheet2.addRow({
        campo: "Notas clínicas",
        valor: clinicalDetails.clinicalNotes || "Sin información registrada",
      });
    }

    const sheet3 = workbook.addWorksheet("Tratamiento e Historial");
    sheet3.views = [{ state: "frozen", ySplit: 1 }];
    if (treatment) {
      sheet3.addRow(["Tratamiento Actual"]);
      addHeaderStyle(sheet3, sheet3.getRow(sheet3.lastRow.number));
      sheet3.addRow(["Inicio", formatDate(treatment.startDate)]);
      sheet3.addRow([
        "Fin",
        treatment.endDate ? formatDate(treatment.endDate) : "No definido",
      ]);
      sheet3.addRow(["Medicamentos"]);
      sheet3.addRow(["Nombre", "Dosis", "Frecuencia"]);
      treatment.medications?.forEach((m) => {
        sheet3.addRow([m.name, m.dosage, m.frequency]);
      });
      sheet3.addRow(["Notas", treatment.notes || "Sin información registrada"]);
    }
    if (history.length > 0 || clinicalHistory.length > 0) {
      sheet3.addRow([]);
      sheet3.addRow(["Historial de Tratamientos"]);
      addHeaderStyle(sheet3, sheet3.getRow(sheet3.lastRow.number));
      history.forEach((group) => {
        const idRow = sheet3.addRow(["Tratamiento ID", group.treatmentId]);
        addIdStyle(idRow);
        group.changes.forEach((entry) => {
          sheet3.addRow([
            "Acción",
            entry.action,
            "Fecha",
            formatDate(entry.timestamp),
          ]);
          sheet3.addRow(["Medicamentos"]);
          sheet3.addRow(["Nombre", "Dosis", "Frecuencia"]);
          entry.treatmentSnapshot?.medications?.forEach((m) => {
            sheet3.addRow([m.name, m.dosage, m.frequency]);
          });
          sheet3.addRow([
            "Notas",
            entry.treatmentSnapshot?.notes || "Sin información registrada",
          ]);
        });
      });
      sheet3.addRow([]);
      sheet3.addRow(["Historial Clínico"]);
      addHeaderStyle(sheet3, sheet3.getRow(sheet3.lastRow.number));
      clinicalHistory.forEach((ch) => {
        sheet3.addRow(["Fecha", formatDate(ch.snapshotDate)]);
        sheet3.addRow(["Peso (kg)", ch.weight ?? "Sin información registrada"]);
        sheet3.addRow(["IMC", ch.bmi ?? "Sin información registrada"]);
        sheet3.addRow(["Síntomas", ch.symptoms?.join(", ") || "Ninguno"]);
        sheet3.addRow([
          "Notas",
          ch.clinicalNotes || "Sin información registrada",
        ]);
        sheet3.addRow(["Fase", ch.phase || "Sin información registrada"]);
        sheet3.addRow([
          "Estado bacteriológico",
          ch.bacteriologicalStatus || "Sin información registrada",
        ]);
        sheet3.addRow([
          "Comorbilidades",
          ch.comorbidities?.join(", ") || "Ninguna",
        ]);
        sheet3.addRow([
          "Estado VIH",
          ch.hivStatus || "Sin información registrada",
        ]);
        sheet3.addRow(["Fumador", ch.smoking ? "Sí" : "No"]);
        sheet3.addRow(["Alcohol", ch.alcoholUse ? "Sí" : "No"]);
        sheet3.addRow(["Contacto con TBC", ch.contactWithTb ? "Sí" : "No"]);
        sheet3.addRow([
          "Tratamiento TBC previo",
          ch.priorTbTreatment ? "Sí" : "No",
        ]);
        sheet3.addRow([
          "Riesgo de adherencia",
          ch.adherenceRisk || "Sin información registrada",
        ]);
      });
    }

    const sheet4 = workbook.addWorksheet("Citas");
    sheet4.columns = [
      { header: "Fecha", key: "fecha", width: 20 },
      { header: "Estado", key: "estado", width: 20 },
      { header: "Motivo", key: "motivo", width: 50 },
    ];
    sheet4.getRow(1).font = { bold: true };
    sheet4.views = [{ state: "frozen", ySplit: 1 }];
    appointments.forEach((appt) => {
      sheet4.addRow({
        fecha: formatDate(appt.date),
        estado: appt.status,
        motivo: appt.reason,
      });
    });

    const sheet5 = workbook.addWorksheet("Alertas");
    sheet5.columns = [
      { header: "Descripción", key: "descripcion", width: 50 },
      { header: "Severidad", key: "severidad", width: 20 },
      { header: "Estado", key: "estado", width: 20 },
    ];
    sheet5.getRow(1).font = { bold: true };
    sheet5.views = [{ state: "frozen", ySplit: 1 }];
    alerts.forEach((alert) => {
      sheet5.addRow({
        descripcion: alert.description,
        severidad: alert.severity,
        estado: alert.status,
      });
    });

    const sheet6 = workbook.addWorksheet("Evaluación del Paciente");
    sheet6.columns = [
      { header: "Campo", key: "campo", width: 30 },
      { header: "Valor", key: "valor", width: 50 },
    ];
    sheet6.getRow(1).font = { bold: true };
    sheet6.views = [{ state: "frozen", ySplit: 1 }];
    if (evaluation) {
      sheet6.addRow({
        campo: "Nivel de adherencia",
        valor: evaluation.adherenceLevel || "N/A",
      });
      sheet6.addRow({
        campo: "Riesgo de abandono",
        valor: evaluation.dropoutRisk || "N/A",
      });
      sheet6.addRow({
        campo: "Abandono detectado",
        valor: evaluation.flags?.abandono ? "Sí" : "No",
      });
      sheet6.addRow({
        campo: "Resistencia detectada",
        valor: evaluation.flags?.resistencia ? "Sí" : "No",
      });
      if (evaluation.recommendations?.length > 0) {
        evaluation.recommendations.forEach((rec, i) => {
          sheet6.addRow({ campo: `Recomendación ${i + 1}`, valor: rec });
        });
      }
      if (evaluation.triggeredRules?.length > 0) {
        sheet6.addRow({
          campo: "Reglas disparadas",
          valor: evaluation.triggeredRules.join(", "),
        });
      }
      if (evaluation.educationalStats) {
        sheet6.addRow({
          campo: "Contenidos educativos vistos",
          valor: evaluation.educationalStats.totalViewed,
        });
        sheet6.addRow({
          campo: "Último acceso educativo",
          valor: evaluation.educationalStats.lastViewedAt
            ? formatDate(evaluation.educationalStats.lastViewedAt)
            : "N/A",
        });
      }
    }
    sheet6.addRow({
      campo: "Doctor responsable",
      valor: req.user.username || "Sin información registrada",
    });
    sheet6.addRow({
      campo: "Fecha de generación",
      valor: formatDate(new Date()),
    });

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

    const dataPromise = await getPatientData(doctorId, patientId);
    if (!dataPromise) {
      return res
        .status(404)
        .json({ message: "Paciente no encontrado o no autorizado." });
    }

    const {
      patient,
      clinicalDetails,
      treatment,
      appointments,
      alerts,
      history,
      clinicalHistory,
    } = dataPromise;

    const evaluation = await evaluatePatient(patientId);

    const data = [];

    const formatDate = (date) =>
      date
        ? format(new Date(date), "dd/MM/yyyy")
        : "Sin información registrada";

    const pushRow = (seccion, subseccion, campo, valor) => {
      data.push({
        Sección: seccion,
        SubSección: subseccion || "",
        Campo: campo,
        Valor: valor || "Sin información registrada",
      });
    };

    pushRow("Paciente", "", "Nombre de usuario", patient.username);
    pushRow("Paciente", "", "Correo electrónico", patient.email);
    pushRow("Paciente", "", "Teléfono", patient.phone);
    pushRow("Paciente", "", "Registrado", formatDate(patient.createdAt));

    if (clinicalDetails) {
      pushRow("Detalles Clínicos", "", "Peso (kg)", clinicalDetails.weight);
      pushRow("Detalles Clínicos", "", "Altura (cm)", clinicalDetails.height);
      pushRow("Detalles Clínicos", "", "IMC", clinicalDetails.bmi);
      pushRow(
        "Detalles Clínicos",
        "",
        "Fecha de diagnóstico",
        formatDate(clinicalDetails.diagnosisDate)
      );
      pushRow(
        "Detalles Clínicos",
        "",
        "Estado bacteriológico",
        clinicalDetails.bacteriologicalStatus
      );
      pushRow(
        "Detalles Clínicos",
        "",
        "Esquema de tratamiento",
        clinicalDetails.treatmentScheme
      );
      pushRow("Detalles Clínicos", "", "Fase", clinicalDetails.phase);
      pushRow(
        "Detalles Clínicos",
        "",
        "Comorbilidades",
        clinicalDetails.comorbidities?.join(", ") || "Ninguna"
      );
      pushRow("Detalles Clínicos", "", "Estado VIH", clinicalDetails.hivStatus);
      pushRow(
        "Detalles Clínicos",
        "",
        "Fumador",
        clinicalDetails.smoking ? "Sí" : "No"
      );
      pushRow(
        "Detalles Clínicos",
        "",
        "Alcohol",
        clinicalDetails.alcoholUse ? "Sí" : "No"
      );
      pushRow(
        "Detalles Clínicos",
        "",
        "Contacto con TBC",
        clinicalDetails.contactWithTb ? "Sí" : "No"
      );
      pushRow(
        "Detalles Clínicos",
        "",
        "Tratamiento TBC previo",
        clinicalDetails.priorTbTreatment ? "Sí" : "No"
      );
      pushRow(
        "Detalles Clínicos",
        "",
        "Síntomas",
        clinicalDetails.symptoms?.join(", ") || "Ninguno"
      );
      pushRow(
        "Detalles Clínicos",
        "",
        "Notas clínicas",
        clinicalDetails.clinicalNotes
      );
    }

    if (treatment) {
      pushRow(
        "Tratamiento Actual",
        "",
        "Inicio",
        formatDate(treatment.startDate)
      );
      pushRow("Tratamiento Actual", "", "Fin", formatDate(treatment.endDate));
      treatment.medications?.forEach((m, i) => {
        pushRow(
          "Tratamiento Actual",
          `Medicamento ${i + 1}`,
          "Detalle",
          `${m.name} - ${m.dosage}, ${m.frequency}`
        );
      });
      pushRow("Tratamiento Actual", "", "Notas", treatment.notes);
    }

    if (history.length > 0) {
      history.forEach((group, gi) => {
        pushRow(
          "Historial de Tratamientos",
          `Grupo ${gi + 1}`,
          "ID Tratamiento",
          group.treatmentId
        );
        group.changes.forEach((entry, i) => {
          pushRow(
            "Historial de Tratamientos",
            `Grupo ${gi + 1} - Cambio ${i + 1}`,
            "Acción",
            entry.action
          );
          pushRow(
            "Historial de Tratamientos",
            `Grupo ${gi + 1} - Cambio ${i + 1}`,
            "Fecha",
            formatDate(entry.timestamp)
          );
          entry.treatmentSnapshot?.medications?.forEach((m, j) => {
            pushRow(
              "Historial de Tratamientos",
              `Grupo ${gi + 1} - Cambio ${i + 1}`,
              `Medicamento ${j + 1}`,
              `${m.name} - ${m.dosage}, ${m.frequency}`
            );
          });
          pushRow(
            "Historial de Tratamientos",
            `Grupo ${gi + 1} - Cambio ${i + 1}`,
            "Notas",
            entry.treatmentSnapshot?.notes
          );
        });
      });
    }

    if (clinicalHistory.length > 0) {
      clinicalHistory.forEach((entry, i) => {
        pushRow(
          "Historial Clínico",
          `Registro ${i + 1}`,
          "Fecha",
          formatDate(entry.snapshotDate)
        );
        pushRow(
          "Historial Clínico",
          `Registro ${i + 1}`,
          "Peso (kg)",
          entry.weight
        );
        pushRow("Historial Clínico", `Registro ${i + 1}`, "IMC", entry.bmi);
        pushRow(
          "Historial Clínico",
          `Registro ${i + 1}`,
          "Síntomas",
          entry.symptoms?.join(", ") || "Ninguno"
        );
        pushRow(
          "Historial Clínico",
          `Registro ${i + 1}`,
          "Notas clínicas",
          entry.clinicalNotes
        );
        pushRow("Historial Clínico", `Registro ${i + 1}`, "Fase", entry.phase);
        pushRow(
          "Historial Clínico",
          `Registro ${i + 1}`,
          "Estado bacteriológico",
          entry.bacteriologicalStatus
        );
        pushRow(
          "Historial Clínico",
          `Registro ${i + 1}`,
          "Comorbilidades",
          entry.comorbidities?.join(", ") || "Ninguna"
        );
        pushRow(
          "Historial Clínico",
          `Registro ${i + 1}`,
          "Estado VIH",
          entry.hivStatus
        );
        pushRow(
          "Historial Clínico",
          `Registro ${i + 1}`,
          "Fumador",
          entry.smoking ? "Sí" : "No"
        );
        pushRow(
          "Historial Clínico",
          `Registro ${i + 1}`,
          "Alcohol",
          entry.alcoholUse ? "Sí" : "No"
        );
        pushRow(
          "Historial Clínico",
          `Registro ${i + 1}`,
          "Contacto con TBC",
          entry.contactWithTb ? "Sí" : "No"
        );
        pushRow(
          "Historial Clínico",
          `Registro ${i + 1}`,
          "Tratamiento TBC previo",
          entry.priorTbTreatment ? "Sí" : "No"
        );
        pushRow(
          "Historial Clínico",
          `Registro ${i + 1}`,
          "Riesgo de adherencia",
          entry.adherenceRisk
        );
      });
    }

    if (appointments.length > 0) {
      appointments.forEach((appt, i) => {
        pushRow("Citas", `Cita ${i + 1}`, "Fecha", formatDate(appt.date));
        pushRow("Citas", `Cita ${i + 1}`, "Estado", appt.status);
        pushRow("Citas", `Cita ${i + 1}`, "Motivo", appt.reason);
      });
    }

    if (alerts.length > 0) {
      alerts.forEach((alert, i) => {
        pushRow("Alertas", `Alerta ${i + 1}`, "Descripción", alert.description);
        pushRow("Alertas", `Alerta ${i + 1}`, "Severidad", alert.severity);
        pushRow("Alertas", `Alerta ${i + 1}`, "Estado", alert.status);
      });
    }

    if (evaluation) {
      pushRow(
        "Evaluación del Paciente",
        "",
        "Nivel de adherencia",
        evaluation.adherenceLevel
      );
      pushRow(
        "Evaluación del Paciente",
        "",
        "Riesgo de abandono",
        evaluation.dropoutRisk
      );
      pushRow(
        "Evaluación del Paciente",
        "",
        "Abandono detectado",
        evaluation.flags?.abandono ? "Sí" : "No"
      );
      pushRow(
        "Evaluación del Paciente",
        "",
        "Resistencia detectada",
        evaluation.flags?.resistencia ? "Sí" : "No"
      );
      evaluation.recommendations?.forEach((rec, i) => {
        pushRow("Evaluación del Paciente", "", `Recomendación ${i + 1}`, rec);
      });
      if (evaluation.triggeredRules?.length > 0) {
        pushRow(
          "Evaluación del Paciente",
          "",
          "Reglas disparadas",
          evaluation.triggeredRules.join(", ")
        );
      }
      if (evaluation.educationalStats) {
        pushRow(
          "Evaluación del Paciente",
          "",
          "Contenidos educativos vistos",
          evaluation.educationalStats.totalViewed
        );
        pushRow(
          "Evaluación del Paciente",
          "",
          "Último acceso educativo",
          formatDate(evaluation.educationalStats.lastViewedAt)
        );
      }
    }

    pushRow(
      "Generación del Reporte",
      "",
      "Doctor responsable",
      req.user.username
    );
    pushRow(
      "Generación del Reporte",
      "",
      "Fecha de generación",
      formatDate(new Date())
    );

    const parser = new Parser({
      fields: ["Sección", "SubSección", "Campo", "Valor"],
      delimiter: ";",
    });
    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv; charset=utf-8");
    res.attachment(`paciente_${patientId}.csv`);
    return res.send(csv);
  } catch (error) {
    console.error("[Error] Error al generar CSV:", error);
    res.status(500).json({ message: "Error al generar el archivo CSV." });
  }
};