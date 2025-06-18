import { Router } from "express";
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";
import { authRequired } from "../middlewares/authRequired.js";

const router = Router();

router.get("/", authRequired, getUserNotifications);

router.put("/:id/read", authRequired, markAsRead);

router.put("/read-all", authRequired, markAllAsRead);

router.delete("/:id", authRequired, deleteNotification);

export default router;
