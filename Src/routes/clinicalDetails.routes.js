import express from "express";
import {
  createOrUpdateClinicalDetails,
  getClinicalDetailsByPatient,
} from "../controllers/clinicalDetails.controller.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";

const router = express.Router();

router.post(
  "/:patientId",
  authorizeRole(["doctor"]),
  createOrUpdateClinicalDetails
);

router.get(
  "/:patientId",
  authorizeRole(["doctor", "patient"]),
  getClinicalDetailsByPatient
);

export default router;
