import mongoose from "mongoose";
const appointmentStatusEnum = [
  "pendiente",
  "confirmada",
  "asistió",
  "no asistió",
  "cancelada",
];

const appointmentHistorySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: ["confirmada","creada", "asistió", "no asistió", "cancelada", "reprogramada"],
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
