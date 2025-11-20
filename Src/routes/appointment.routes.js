import { Router } from "express";
import {
  createAppointment,
  updateAppointmentStatus,
  getAppointmentHistory,
  rescheduleAppointment,
  deleteAppointment,
  getAppointments,
  updateAppointmentTimes,
} from "../controllers/appointment.controller.js";
import { authRequired } from "../middlewares/authRequired.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";

const router = Router();

router.post("/", authRequired, authorizeRole(["doctor", "patient"]), createAppointment);

router.get(
  "/",
  authRequired,
  authorizeRole(["doctor", "patient"]),
  getAppointments
);

router.put(
  "/:appointmentId/status",
  authorizeRole(["doctor","patient"]),
  updateAppointmentStatus
);

router.get("/:appointmentId/history", authRequired, getAppointmentHistory);
router.put(
  "/:appointmentId/reschedule",
  authorizeRole(["doctor"]),
  rescheduleAppointment
);

router.delete("/:appointmentId", authRequired, deleteAppointment);

router.patch(
  "/:appointmentId/times",
  authRequired,
  authorizeRole(["doctor", "patient"]),
  updateAppointmentTimes
);

export default router;
