import mongoose from "mongoose";

const treatmentHistorySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: ["create", "update", "delete"],
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
    treatmentSnapshot: {
      startDate: Date,
      endDate: Date,
      medications: [
        {
          name: String,
          dose: String,
          frequency: String,
        },
      ],
      notes: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("TreatmentHistory", treatmentHistorySchema);
