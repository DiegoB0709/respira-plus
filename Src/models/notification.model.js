import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["alerta", "cita", "educativo", "info"],
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    emailed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, 
  }
);

export default mongoose.models.Notification ||mongoose.model("Notification", notificationSchema);
