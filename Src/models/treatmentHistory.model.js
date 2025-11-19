import mongoose from "mongoose";

const treatmentHistorySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: ["create", "update", "delete", "finished"],
      required: true,
    },
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
    treatment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Treatment",
      required: true,
    },
    treatmentSnapshot: {
      startDate: Date,
      endDate: Date,
      medications: [
        {
          name: String,
          dosage: String,
          frequency: String,
        },
      ],
      notes: String,
      finalObservation: String,
      isRecurrence: {
        type: Boolean,
        default: false,
      },
      abandonment: {
        type: Boolean,
        default: false,
      },
      recurrenceReason: String,
      observationDate: Date,
    },
    actionBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    observation: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("TreatmentHistory", treatmentHistorySchema);
