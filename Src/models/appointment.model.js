import mongoose from "mongoose";

const appointmentStatusEnum = [
  "pendiente",
  "asistió",
  "no asistió",
  "cancelada",
  "confirmada",
  "solicitada",
  "no atendida",
];

const appointmentHistorySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: [
        "creada",
        "asistió",
        "no asistió",
        "cancelada",
        "confirmada",
        "reprogramada",
        "solicitada",
        "no atendida",
      ],
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { _id: false }
);

const appointmentSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: appointmentStatusEnum,
      default: "pendiente",
    },
    arrivalTime: {
      type: Date,
      default: null,
    },
    consultationStartTime: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
    },
    treatment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Treatment",
    },
    history: [appointmentHistorySchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Appointment", appointmentSchema);
