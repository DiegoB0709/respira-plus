import express from "express";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import {
  getMetricsForDoctor,
  getMetricsForAdmin,
} from "../controllers/metrics.controller.js";

const router = express.Router();

router.get("/doctor", authorizeRole("doctor"), getMetricsForDoctor);

router.get("/admin", authorizeRole("admin"), getMetricsForAdmin);

export default router;
