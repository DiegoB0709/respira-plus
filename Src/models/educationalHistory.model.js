import mongoose from "mongoose";

const educationalHistorySchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EducationalContent",
      required: true,
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
    feedback: {
      type: String,
      default: "", 
    },
    completed: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("EducationalHistory", educationalHistorySchema);
