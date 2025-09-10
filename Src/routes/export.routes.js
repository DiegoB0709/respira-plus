import { Router } from "express";
import {
  exportClinicalDataExcel,
  exportClinicalDataPDF,
  exportClinicalDataCSV,
} from "../controllers/export.controller.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";

const router = Router();

router.get(
  "/excel/:patientId",
  authorizeRole(["doctor"]),
  exportClinicalDataExcel
);

router.get(
  "/pdf/:patientId",
  authorizeRole(["doctor"]),
  exportClinicalDataPDF
);

router.get(
  "/csv/:patientId",
  authorizeRole(["doctor"]),
  exportClinicalDataCSV
);

export default router;
