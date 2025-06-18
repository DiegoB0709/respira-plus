import { Router } from "express";
import {
  getRecommendedContentForPatient,
  registerContentView,
  getEducationalHistory,
  uploadEducationalContent,
  getDoctorUploads,
  deleteEducationalContent,
  updateEducationalContent,
  getEducationalContentById,
  getPublicEducationalContent,
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
  getRecommendedContentForPatient
);

router.post("/view/:contentId", authorizeRole("patient"), registerContentView);

router.get("/history", authorizeRole("patient"), getEducationalHistory);

router.get("/public", getPublicEducationalContent);

router.post(
  "/upload",
  authorizeRole("doctor"),
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

export default router;