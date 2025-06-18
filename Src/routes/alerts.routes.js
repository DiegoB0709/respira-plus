import { Router } from "express";
import {
  getAlertsByDoctor,
  getAlertsByPatient,
  getAlertById,
  updateAlertStatus,
} from "../controllers/alerts.controller.js";
import { authRequired } from "../middlewares/authRequired.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";

const router = Router();

router.get("/doctor", authorizeRole("doctor"), getAlertsByDoctor);

router.get("/patient/:patientId", authRequired, getAlertsByPatient);

router.get("/:id", authRequired, getAlertById);

router.patch("/:id/status", authRequired, updateAlertStatus);

export default router;
