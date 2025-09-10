import { Router } from "express";
import { upload } from "../middlewares/upload.middleware.js";
import {
  getEducationalContentForPatient,
  registerContentView,
  getEducationalHistory,
  uploadEducationalContent,
  getDoctorUploads,
  deleteEducationalContent,
  updateEducationalContent,
  getEducationalContentById,
  getEducationalHistoryByContent,
} from "../controllers/educational.controller.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import {
  educationalContentSchema,
  educationalContentUpdateSchema,
} from "../schemas/educational.schema.js";
import { validateSchema } from "../middlewares/validateSchema.js";

const router = Router();

router.get(
  "/recommendations",
  authorizeRole("patient"),
  getEducationalContentForPatient
);

router.post("/view/:contentId", authorizeRole("patient"), registerContentView);

router.get(
  "/history/patient/:id",
  authorizeRole(["doctor"]),
  getEducationalHistory
);

router.post(
  "/upload",
  authorizeRole("doctor"),
  upload.single("file"),
  validateSchema(educationalContentSchema),
  uploadEducationalContent
);

router.get("/my-uploads", authorizeRole("doctor"), getDoctorUploads);

router.put(
  "/edit/:id",
  authorizeRole("doctor"),
  validateSchema(educationalContentUpdateSchema),
  updateEducationalContent
);

router.delete("/delete/:id", authorizeRole("doctor"), deleteEducationalContent);

router.get("/:id", getEducationalContentById);

router.get(
  "/history/:contentId",
  authorizeRole(["patient", "doctor"]),
  getEducationalHistoryByContent
);

export default router;