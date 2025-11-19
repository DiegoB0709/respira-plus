import mongoose from "mongoose";

const treatmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
      unique: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    medications: [
      {
        name: String,
        dosage: String,
        frequency: String,
        _id: false,
      },
    ],
    notes: String,
    status: {
      type: String,
      enum: ["Activo", "Finalizado"],
      default: "Activo",
    },

    finalObservation: String,
    isRecurrence: {
      type: Boolean,
      default: false,
    },
    recurrenceReason: String,
    observationDate: Date,
    abandonment: {
      type: Boolean,
      default: false,
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

export default mongoose.model("Treatment", treatmentSchema);
