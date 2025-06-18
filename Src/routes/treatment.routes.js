import { Router } from "express";
import {
  createOrUpdateTreatment,
  getTreatmentByPatient,
  getAllTreatmentsForDoctor,
  deleteTreatment,
  getTreatmentHistory,
} from "../controllers/treatment.controller.js";

import { authorizeRole } from "../middlewares/authorizeRole.js";
import { authRequired } from "../middlewares/authRequired.js";


const router = Router();

router.put(
  "/:patientId",
  authorizeRole("doctor"),
  createOrUpdateTreatment
);

router.get("/:patientId", authRequired, getTreatmentByPatient);

router.get(
  "/",
  authorizeRole("doctor"),
  getAllTreatmentsForDoctor
);

router.delete(
  "/:patientId",
  authorizeRole("doctor"),
  deleteTreatment
);
router.get("/history/:patientId", authRequired, getTreatmentHistory);


export default router;
