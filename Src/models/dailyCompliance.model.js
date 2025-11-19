import mongoose from "mongoose";

const dailyComplianceSchema = new mongoose.Schema(
  {
    treatment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Treatment",
      required: true,
      index: true,
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
    status: {
      type: String,
      enum: ["Cumplió", "No Cumplió"],
      required: true,
    },
    patientNote: String,
  },
  { timestamps: true }
);

export default mongoose.model("DailyCompliance", dailyComplianceSchema);
