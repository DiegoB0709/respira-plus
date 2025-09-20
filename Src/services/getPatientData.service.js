import ClinicalDetails from "../models/clinicalDetails.model.js";
import Users from "../models/user.model.js";
import Treatment from "../models/treatment.model.js";
import Appointment from "../models/appointment.model.js";
import Alert from "../models/alert.model.js";
import TreatmentHistory from "../models/treatmentHistory.model.js";
import ClinicalHistory from "../models/clinicalHistory.model.js";

export const getPatientData = async (doctorId, patientId) => {
  const patient = await Users.findOne({
    _id: patientId,
    role: "patient",
    doctor: doctorId,
  });
  if (!patient) return null;

  const [
    clinicalDetails,
    treatment,
    appointments,
    alerts,
    treatmentHistory,
    clinicalHistory,
  ] = await Promise.all([
    ClinicalDetails.findOne({ patient: patientId }),
    Treatment.findOne({ patient: patientId }),
    Appointment.find({ patient: patientId }).sort({ date: -1 }),
    Alert.find({ patient: patientId }).sort({ createdAt: -1 }),
    TreatmentHistory.aggregate([
      { $match: { patient: patient._id } },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: "$treatment",
          changes: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
          treatmentId: "$_id",
          changes: 1,
        },
      },
    ]),
    ClinicalHistory.find({ patient: patientId }).sort({ snapshotDate: -1 }),
  ]);

  const simplifiedAppointments = appointments.map((appt) => {
    const lastUpdate =
      appt.history?.length > 0 ? appt.history[appt.history.length - 1] : null;
    return {
      _id: appt._id,
      date: appt.date,
      reason: appt.reason,
      notes: appt.notes,
      status: lastUpdate ? lastUpdate.action : appt.status,
      lastUpdated: lastUpdate ? lastUpdate.date : appt.updatedAt,
    };
  });

  return {
    patient,
    clinicalDetails,
    treatment,
    appointments: simplifiedAppointments,
    alerts,
    history: treatmentHistory,
    clinicalHistory,
  };
};
