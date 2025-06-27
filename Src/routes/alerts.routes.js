import { Router } from "express";
import {
  getAlertsByDoctor,
  getAlertsByPatient,
  getAlertById,
  updateAlertStatus,
} from "../controllers/alerts.controller.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";

const router = Router();

router.get("/doctor", authorizeRole("doctor"), getAlertsByDoctor);

router.get("/patient/:patientId", authorizeRole("doctor"), getAlertsByPatient);

router.get("/:alertId", authorizeRole("doctor"), getAlertById);

router.patch("/:id/status", authorizeRole("doctor"), updateAlertStatus);

export default router;
