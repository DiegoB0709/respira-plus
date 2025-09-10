import mongoose from "mongoose";

const clinicalHistorySchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    weight: Number,
    bmi: Number,
    symptoms: [String],
    clinicalNotes: String,
    phase: {
      type: String,
      enum: ["inicio", "intermedio", "final", "indefinido"],
    },
    bacteriologicalStatus: {
      type: String,
      enum: ["positivo", "negativo", "no confirmado"],
    },
    comorbidities: [String],
    hivStatus: {
      type: String,
      enum: ["positivo", "negativo", "desconocido"],
    },
    smoking: Boolean,
    alcoholUse: Boolean,
    contactWithTb: Boolean,
    priorTbTreatment: Boolean,
    adherenceRisk: {
      type: String,
      enum: ["bajo", "medio", "alto"],
    },
    snapshotDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.ClinicalHistory ||
  mongoose.model("ClinicalHistory", clinicalHistorySchema);
