import { Router } from "express";
import { evaluatePatientController } from "../controllers/ai.controller.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";

const router = Router();

router.get(
  "/evaluate/:patientId",
  authorizeRole(["doctor"]),
  evaluatePatientController
);

export default router;
