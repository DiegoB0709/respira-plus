import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "baja_adherencia",
        "riesgo_abandono",
        "tratamiento_inefectivo",
        "resistencia_medicamentosa",
        "inactividad_prolongada",
        "falta_educacion",
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    triggeredRules: [
      {
        type: String,
      },
    ],
    severity: {
      type: String,
      enum: ["baja", "media", "alta"],
      default: "media",
    },
    status: {
      type: String,
      enum: ["activa", "resuelta"],
      default: "activa",
    },
    actionTaken: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Alert || mongoose.model("Alert", alertSchema);
