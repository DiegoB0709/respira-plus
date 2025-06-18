import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const transporterReady = new Promise((resolve, reject) => {
  transporter.verify((error, success) => {
    if (error) {
      console.error(
        "[SERVER] Error al establecer coneccion con el servidor de correo:",
        error
      );
      reject(error);
    } else {
      console.log(
        "[SERVER] Conexión con el servidor de correo establecida exitosamente"
      );
      resolve(true);
    }
  });
});

export { transporter, transporterReady };
