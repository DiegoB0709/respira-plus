import express from "express";
import morgan from "morgan";
import cookieparser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/auth.routes.js";
import clinicalDetailsRoutes from "./routes/clinicalDetails.routes.js";
import doctor from "./routes/doctor.routes.js";
import treatmentRoutes from "./routes/treatment.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import alertRoutes from "./routes/alerts.routes.js";
import exportRoutes from "./routes/export.routes.js";
import metricsRoutes from "./routes/metrics.routes.js";
import educationalRoutes from "./routes/educational.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", "http://localhost:5173"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  })
);

//app.use(morgan("dev"));
app.use(express.json());
app.use(cookieparser());

app.use("/api/auth", authRoutes);
app.use("/api/clinical-details", clinicalDetailsRoutes);
app.use("/api/doctor", doctor);
app.use("/api/treatments", treatmentRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/metrics", metricsRoutes);
app.use("/api/educational", educationalRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/user", userRoutes);

export default app;
