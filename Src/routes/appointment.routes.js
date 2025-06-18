import { Router } from "express";
import {
  createAppointment,
  getAppointmentsByPatient,
  getAppointmentsByDoctor,
  updateAppointmentStatus,
  getAppointmentHistory,
  rescheduleAppointment,
  deleteAppointment,
  getUpcomingAppointmentsForUser,
} from "../controllers/appointment.controller.js";

import { authRequired } from "../middlewares/authRequired.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";

const router = Router();

router.post("/", authRequired, authorizeRole(["doctor"]), createAppointment);
router.get("/patient/:patientId", authRequired, getAppointmentsByPatient);
router.get(
  "/doctor",
  authorizeRole(["doctor"]),
  getAppointmentsByDoctor
);
router.put(
  "/:appointmentId/status",
  authorizeRole(["doctor"]),
  updateAppointmentStatus
);
router.get("/:appointmentId/history", authRequired, getAppointmentHistory);
router.put(
  "/:appointmentId/reschedule",
  authorizeRole(["doctor"]),
  rescheduleAppointment
);
router.delete("/:appointmentId", authRequired, deleteAppointment);
router.get("/upcoming", authRequired, getUpcomingAppointmentsForUser);

export default router;
