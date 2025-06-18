import express from "express";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import {
  getMetricsForDoctor,
  getMetricsForAdmin,
  exportDoctorMetricsPDF,
  exportAdminMetricsExcel,
  exportAdminMetricsCSV,
} from "../controllers/metrics.controller.js";

const router = express.Router();

router.get("/doctor", authorizeRole("doctor"), getMetricsForDoctor);

router.get(
  "/doctor/export/pdf",
  authorizeRole("doctor"),
  exportDoctorMetricsPDF
);

router.get("/admin", authorizeRole("admin"), getMetricsForAdmin);

router.get(
  "/admin/export/excel",
  authorizeRole("admin"),
  exportAdminMetricsExcel
);

router.get("/admin/export/csv", authorizeRole("admin"), exportAdminMetricsCSV);

export default router;
