import Notification from "../models/notification.model.js";
import { transporter, transporterReady } from "../libs/mailer.js";

export const sendPendingNotifications = async () => {
  try {
    await transporterReady;

    const notificaciones = await Notification.find({
      read: false,
      emailed: false,
    }).populate("recipient", "email username");

    const notificacionesPorUsuario = {};

    for (const noti of notificaciones) {
      const userId = noti.recipient._id;
      if (!notificacionesPorUsuario[userId]) {
        notificacionesPorUsuario[userId] = {
          user: noti.recipient,
          notificaciones: [],
        };
      }
      notificacionesPorUsuario[userId].notificaciones.push(noti);
    }

    for (const { user, notificaciones } of Object.values(
      notificacionesPorUsuario
    )) {
      if (!user.email) continue;

      const contenidoTexto = notificaciones
        .map(
          (n) => `${n.title}\n${n.message}\n${n.createdAt.toLocaleString()}\n`
        )
        .join("\n");

      const contenidoHTML = `
        <p>Hola <strong>${user.username || "usuario"}</strong>,</p>
        <p>Tienes las siguientes notificaciones pendientes:</p>
        <ul>
          ${notificaciones
            .map(
              (n) => `
              <li>
                <strong>${n.title}:</strong> ${n.message}<br />
                <em>${n.createdAt.toLocaleString()}</em>
              </li>
            `
            )
            .join("")}
        </ul>
        <p>Por favor, ingresa a la plataforma para más detalles.</p>
      `;

      const mailOptions = {
        from: `"TBC Notificaciones" <${process.env.EMAIL_FROM}>`,
        to: user.email,
        subject: "Tienes nuevas notificaciones pendientes",
        text: `Hola ${
          user.username || "usuario"
        },\n\nTienes las siguientes notificaciones sin leer:\n\n${contenidoTexto}\n\nPor favor, revisa tu plataforma para más detalles.`,
        html: contenidoHTML,
      };

      try {
        await transporter.sendMail(mailOptions);

        for (const n of notificaciones) {
          n.emailed = true;
          await n.save();
        }

        console.log(`[MAIL] Correo enviado a ${user.email}`);
      } catch (error) {
        console.error(
          `[MAIL] Error al enviar correo a ${user.email}:`,
          error.message
        );
      }
    }

    console.log(
      "[MAIL] Envío de notificaciones por correo finalizado correctamente."
    );
  } catch (error) {
    console.error(
      "[MAIL] Error general en el envío de notificaciones:",
      error.message
    );
  }
};
