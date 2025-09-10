import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../libs/cloudinary.js";
import crypto from "crypto";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const uniqueSuffix = crypto.randomBytes(8).toString("hex");
    return {
      folder: "educational-content",
      resource_type: file.mimetype.startsWith("image/") ? "image" : "video",
      public_id: `${file.mimetype}-${uniqueSuffix}`,
    };
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file) return cb(null, true);
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes o videos"));
    }
  },
});
