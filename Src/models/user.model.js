import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      trim: true,
      unique: true,
      sparse: true,
    },
    phone: {
      type: String,
      required: false,
      trim: true,
    },
    password: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["admin", "doctor", "patient", "server"],
      required: true,
    },
    registrationToken: {
      type: String,
      unique: true,
      sparse: true,
    },
    registrationExpiresAt: {
      type: Date,
      default: function () {
        return this.registrationToken
          ? new Date(Date.now() + 72 * 60 * 60 * 1000)
          : undefined;
      },
      expires: 0,
    },
    assignedPatients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Users || mongoose.model("Users", userSchema);

