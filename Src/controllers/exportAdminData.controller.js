import PDFDocument from "pdfkit";
import Alert from "../models/alert.model.js";
import Appointment from "../models/appointment.model.js";
import Treatment from "../models/treatment.model.js";
import DailyCompliance from "../models/dailyCompliance.model.js";
import Users from "../models/user.model.js";
import TreatmentHistory from "../models/treatmentHistory.model.js";

const formatDate = (d) =>
  d ? new Date(d).toLocaleString("es-PE") : "Sin registro";
const minutesBetween = (a, b) => Math.round((b - a) / 60000);

const formatDuration = (minutes) => {
  if (!minutes || minutes <= 0) return "0 min";
  const days = Math.floor(minutes / (60 * 24));
  const hours = Math.floor((minutes % (60 * 24)) / 60);
  const mins = minutes % 60;
  let result = [];
  if (days) result.push(`${days} días`);
  if (hours) result.push(`${hours} horas`);
  if (mins) result.push(`${mins} minutos`);
  return result.join(", ");
};


export const generateReportPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    let user = null;
    if (id) {
      user = await Users.findById(id);
      if (!user)
        return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const hasRange = startDate && endDate;
    const start = hasRange ? new Date(startDate) : null;
    const end = hasRange ? new Date(endDate) : null;

    let treatmentFilter = {};
    let alertFilter = {};
    let appointmentFilter = {};

    if (id && user.role === "patient") {
      treatmentFilter.patient = id;
      alertFilter.patient = id;
      appointmentFilter.patient = id;
    }

    if (id && user.role === "doctor") {
      treatmentFilter.doctor = id;
      alertFilter.doctor = id;
      appointmentFilter.doctor = id;
    }

    if (hasRange) {
      treatmentFilter.startDate = { $gte: start, $lte: end };
      alertFilter.createdAt = { $gte: start, $lte: end };
      appointmentFilter.date = { $gte: start, $lte: end };
    }

    const [treatments, alerts, appointments] = await Promise.all([
      Treatment.find(treatmentFilter).populate("patient doctor"),
      Alert.find(alertFilter).populate("patient doctor"),
      Appointment.find(appointmentFilter).populate("patient doctor"),
    ]);

    const treatmentIds = treatments.map((t) => t._id);

    const complianceAgg = treatmentIds.length
      ? await DailyCompliance.aggregate([
          { $match: { treatment: { $in: treatmentIds } } },
          {
            $group: {
              _id: "$treatment",
              missed: {
                $sum: { $cond: [{ $eq: ["$status", "No Cumplió"] }, 1, 0] },
              },
            },
          },
        ])
      : [];

    const missedMap = new Map();
    complianceAgg.forEach((c) => missedMap.set(String(c._id), c.missed));

    const doctorsMap = new Map();

    const addRecord = (docId, docObj, patientObj, section, record) => {
      if (!doctorsMap.has(String(docId)))
        doctorsMap.set(String(docId), { doctor: docObj, patients: new Map() });
      const entry = doctorsMap.get(String(docId));
      if (!entry.patients.has(String(patientObj._id)))
        entry.patients.set(String(patientObj._id), {
          patient: patientObj,
          treatments: [],
          alerts: [],
          appointments: [],
        });
      entry.patients.get(String(patientObj._id))[section].push(record);
    };

    treatments.forEach((t) =>
      addRecord(t.doctor._id, t.doctor, t.patient, "treatments", t)
    );

    alerts.forEach((a) =>
      addRecord(a.doctor._id, a.doctor, a.patient, "alerts", a)
    );

    appointments.forEach((c) =>
      addRecord(c.doctor._id, c.doctor, c.patient, "appointments", c)
    );

    const doc = new PDFDocument({ margin: 40, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=report.pdf");
    doc.pipe(res);

    doc
      .fontSize(20)
      .text(id ? "Resumen Individual" : "Resumen General", { align: "center" });
    doc.moveDown(1);

    doc.fontSize(16).text("Tratamientos");
    for (const [, dEntry] of doctorsMap) {
      const doctor = dEntry.doctor;
      const hasDoctorData = [...dEntry.patients.values()].some(
        (p) => p.treatments.length > 0
      );
      doc.moveDown(0.5);
      doc
        .fontSize(14)
        .text(`Doctor: ${doctor.username || doctor.email || doctor._id}`);
      if (!hasDoctorData) {
        doc.fontSize(11).text("  Sin tratamientos registrados");
        continue;
      }

      for (const [, pEntry] of dEntry.patients) {
        const patient = pEntry.patient;
        doc.moveDown(0.3);
        doc
          .fontSize(12)
          .text(
            `Paciente: ${patient.username || patient.email || patient._id}`
          );

        pEntry.treatments.forEach((t) => {
          const missed = missedMap.get(String(t._id)) || 0;
          doc.fontSize(11).text(`    Inicio: ${formatDate(t.startDate)}`);
          doc.text(
            `    Fin: ${t.endDate ? formatDate(t.endDate) : "En curso"}`
          );
          doc.text(`    Reincidencia: ${t.isRecurrence ? "Sí" : "No"}`);
          if (t.isRecurrence)
            doc.text(
              `    Razón de reincidencia: ${
                t.recurrenceReason || "Sin especificar"
              }`
            );
          if (t.observationDate)
            doc.text(`    Fecha observación: ${formatDate(t.observationDate)}`);
          doc.text(
            `    Observaciones: ${
              t.notes || t.finalObservation || "Sin observaciones"
            }`
          );
          doc.text(`    Abandono: ${t.abandonment ? "Sí" : "No"}`);
          doc.text(`    Días incumplidos: ${missed}`);
          doc.moveDown(0.2);
        });
        const patientHistory = await TreatmentHistory.find({
          patient: patient._id,
        });
        const totalPastTreatments = patientHistory.length;
        const reincidencias = patientHistory.filter(
          (h) => h.treatmentSnapshot.isRecurrence
        );
        const abandonos = patientHistory.filter(
          (h) => h.treatmentSnapshot.abandonment
        );

        if (totalPastTreatments > 0) {
          doc.fontSize(11).text(`  Historial del paciente:`);
          doc.text(`    Total tratamientos pasados: ${totalPastTreatments}`);

          if (reincidencias.length) {
            doc.text(`    Reincidencias:`);
            reincidencias.forEach((r) =>
              doc.text(
                `      - ${formatDate(
                  r.treatmentSnapshot.observationDate || r.timestamp
                )}`
              )
            );
          } else {
            doc.text(`    Sin reincidencias`);
          }

          if (abandonos.length) {
            doc.text(`    Abandonos:`);
            abandonos.forEach((a) =>
              doc.text(
                `      - ${formatDate(
                  a.treatmentSnapshot.observationDate || a.timestamp
                )}`
              )
            );
          } else {
            doc.text(`    Sin abandonos`);
          }

          doc.moveDown(0.2);
        }

        if (pEntry.treatments.length === 0) {
          doc.fontSize(11).text("  Sin tratamientos registrados");
          continue;
        }
      }
    }

    doc.addPage();
    doc.fontSize(16).text("Alertas");
    for (const [, dEntry] of doctorsMap) {
      const doctor = dEntry.doctor;
      const hasDoctorData = [...dEntry.patients.values()].some(
        (p) => p.alerts.length > 0
      );
      doc.moveDown(0.5);
      doc
        .fontSize(14)
        .text(`Doctor: ${doctor.username || doctor.email || doctor._id}`);
      if (!hasDoctorData) {
        doc.fontSize(11).text("  Sin alertas registradas");
        continue;
      }
      for (const [, pEntry] of dEntry.patients) {
        const patient = pEntry.patient;
        doc.moveDown(0.3);
        doc
          .fontSize(12)
          .text(
            `Paciente: ${patient.username || patient.email || patient._id}`
          );
        if (pEntry.alerts.length === 0) {
          doc.fontSize(11).text("  Sin alertas registradas");
          continue;
        }
        pEntry.alerts.forEach((a) => {
          const created = a.createdAt;
          const resolved = a.status === "resuelta" ? a.updatedAt : null;
          const response = resolved
            ? formatDuration(minutesBetween(created, resolved))
            : "No resuelta";

          doc.fontSize(11).text(`  - Creada: ${formatDate(created)}`);
          doc.text(
            `    Atendida: ${resolved ? formatDate(resolved) : "Pendiente"}`
          );
          doc.text(`    Tiempo de respuesta: ${response}`);
          doc.text(`    Tipo: ${a.type}`);
          doc.text(
            `    Observación/Comentarios: ${
              a.actionTaken || a.description || "Sin registro"
            }`
          );
          doc.moveDown(0.2);
        });
      }
    }

    doc.addPage();
    doc.fontSize(16).text("Citas");
    for (const [, dEntry] of doctorsMap) {
      const doctor = dEntry.doctor;
      const hasDoctorData = [...dEntry.patients.values()].some(
        (p) => p.appointments.length > 0
      );
      doc.moveDown(0.5);
      doc
        .fontSize(14)
        .text(`Doctor: ${doctor.username || doctor.email || doctor._id}`);
      if (!hasDoctorData) {
        doc.fontSize(11).text("  Sin citas registradas");
        continue;
      }
      for (const [, pEntry] of dEntry.patients) {
        const patient = pEntry.patient;
        doc.moveDown(0.3);
        doc
          .fontSize(12)
          .text(
            `Paciente: ${patient.username || patient.email || patient._id}`
          );
        if (pEntry.appointments.length === 0) {
          doc.fontSize(11).text("  Sin citas registradas");
          continue;
        }
        pEntry.appointments.forEach((c) => {
          const arrival = c.arrivalTime;
          const attended = c.consultationStartTime;
          const scheduled = c.date;
          const wait =
            arrival && attended
              ? `${minutesBetween(arrival, attended)} min`
              : "No disponible";
          let onTime = "No";
          if (arrival && attended) {
            if (arrival <= scheduled && attended <= scheduled) onTime = "Sí";
            else if (arrival > scheduled && attended - arrival <= 10 * 60000)
              onTime = "Sí";
          } else if (!arrival && attended && attended <= scheduled) {
            onTime = "Sí";
          }
          const obs = [];
          if (arrival && arrival > scheduled) obs.push("Paciente llegó tarde");
          if (arrival && arrival <= scheduled)
            obs.push("Paciente llegó a tiempo/antes");
          if (!arrival) obs.push("Hora de llegada sin registrar");
          doc
            .fontSize(11)
            .text(`  - Hora programada: ${formatDate(scheduled)}`);
          doc.text(`    Hora llegada: ${formatDate(arrival)}`);
          doc.text(`    Hora atención: ${formatDate(attended)}`);
          doc.text(`    Tiempo de espera: ${wait}`);
          doc.text(`    Atendido a tiempo: ${onTime}`);
          doc.text(`    Estado / Cumplimiento: ${c.status}`);
          if (c.notes) doc.text(`    Observaciones: ${c.notes}`);
          if (obs.length) doc.text(`    Notas: ${obs.join(", ")}`);
          doc.moveDown(0.2);
        });
      }
    }

    doc.end();
  } catch (err) {
    res.status(500).json({ error: "Error generando PDF" });
  }
};
