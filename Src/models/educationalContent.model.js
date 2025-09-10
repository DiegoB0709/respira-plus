import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  cloudinaryPublicId: { type: String, required: true },
  fileType: { type: String, enum: ["image", "video"], required: true },
});

const educationalContentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    media: {
      type: [mediaSchema],
      required: true,
      validate: {
        validator: function (mediaArr) {
          return mediaArr && mediaArr.length > 0;
        },
        message: "Debe proporcionar al menos un archivo de imagen o video.",
      },
    },
    fileType: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    uploadBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    relatedSymptoms: [String],
    treatmentStage: {
      type: String,
      enum: ["inicio", "intermedio", "final", "indefinido"],
      default: "indefinido",
    },
    clinicalTags: [
      {
        type: String,
        enum: [
          "riesgo_abandono_alto",
          "posible_resistencia",
          "adh_baja",
          "abandono_probable",
        ],
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.EducationalContent ||
  mongoose.model("EducationalContent", educationalContentSchema);
