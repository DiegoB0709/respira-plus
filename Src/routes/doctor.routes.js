import { Router } from "express";
import {
  getMyPatients,
  updatePatientInfo,
} from "../controllers/doctor.controller.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";

const router = Router();

router.use(authorizeRole(["doctor"]));

router.get("/patients", getMyPatients);

router.put("/patient/:patientId", updatePatientInfo);

export default router;