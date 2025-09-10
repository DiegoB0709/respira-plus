import { Router } from "express";
import {
  login,
  register,
  logout,
  verifyToken,
  createRegistrationToken,
} from "../controllers/auth.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import {
  registerSchema,
  loginSchema,
  tokenSchema,
} from "../schemas/auth.schema.js";

const router = Router();

router.post("/register", validateSchema(registerSchema), register);

router.post("/login", validateSchema(loginSchema), login);

router.post("/logout", logout);

router.get("/verify", verifyToken);

router.post(
  "/generate-token",
  authorizeRole(["admin", "doctor"]),
  validateSchema(tokenSchema),
  createRegistrationToken
);

export default router;
