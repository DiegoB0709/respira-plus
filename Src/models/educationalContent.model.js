import mongoose from "mongoose";

const educationalContentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ["video", "image", "pdf", "article"],
      required: true,
    },
    uploadBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    relatedSymptoms: [
      {
        type: String,
      },
    ],
    treatmentStage: {
      type: String,
      enum: ["inicio", "intermedio", "final", "indefinido"],
      default: "indefinido",
    },
    clinicalTags: [
      {
        type: String,
      },
    ],

    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.EducationalContent ||
  mongoose.model("EducationalContent", educationalContentSchema);
