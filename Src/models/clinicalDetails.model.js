import mongoose from "mongoose";

const clinicalDetailsSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
      unique: true,
    },
    weight: Number,
    height: Number,
    bmi: Number,
    diagnosisDate: Date,
    bacteriologicalStatus: {
      type: String,
      enum: ["positivo", "negativo", "no confirmado"],
    },
    treatmentScheme: String,
    phase: {
      type: String,
      enum: ["intensiva", "sostenimiento", "finalizada"],
      default: "intensiva",
    },
    comorbidities: [String],
    hivStatus: {
      type: String,
      enum: ["positivo", "negativo", "desconocido"],
      default: "desconocido",
    },
    smoking: Boolean,
    alcoholUse: Boolean,
    contactWithTb: Boolean,
    priorTbTreatment: Boolean,
    symptoms: [String],
    clinicalNotes: String,
    adherenceRisk: {
      type: String,
      enum: ["bajo", "medio", "alto"],
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ClinicalDetails ||
  mongoose.model("ClinicalDetails", clinicalDetailsSchema);
