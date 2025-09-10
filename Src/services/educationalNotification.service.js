import EducationalContent from "../models/EducationalContent.model.js";
import User from "../models/User.model.js";
import EducationalHistory from "../models/EducationalHistory.model.js";
import { crearNotificacion } from "./notification.service.js";
import { evaluatePatient } from "./ai.service.js";

export const analyzeAndNotifyContent = async (contenidoId) => {
  try {
    const contenido = await EducationalContent.findById(contenidoId).populate(
      "uploadBy"
    );
    if (!contenido) throw new Error("Contenido no encontrado");

    if (contenido.isPublic) {
      const pacientes = await User.find({ role: "patient", isActive: true });

      await Promise.all(
        pacientes.map((p) =>
          crearNotificacion({
            recipientId: p._id,
            title: "Nuevo contenido educativo disponible",
            message: `El doctor ${
              contenido.uploadBy.username || "de tu centro"
            } ha subido un nuevo recurso educativo: ${contenido.title}`,
            type: "educativo",
          })
        )
      );

      return { public: true, notified: pacientes.length };
    } else {
      const doctorId = contenido.uploadBy;
      const pacientesAsignados = await User.find({
        doctor: doctorId,
        role: "patient",
        isActive: true,
      });

      let totalNotificados = 0;

      for (const paciente of pacientesAsignados) {
        const yaVisto = await EducationalHistory.findOne({
          patient: paciente._id,
          content: contenido._id,
        });
        if (yaVisto) continue;

        const evaluation = await evaluatePatient(paciente._id);

        const match = contenido.clinicalTags.some((tag) => {
          return (
            evaluation.triggeredRules.includes(tag) ||
            (evaluation.flags.abandono && tag === "abandono_probable") ||
            (evaluation.flags.resistencia && tag === "resistencia_tb") ||
            (evaluation.adherenceLevel === "baja" && tag === "adh_baja")
          );
        });

        if (match) {
          await crearNotificacion({
            recipientId: paciente._id,
            title: "Recomendación educativa personalizada",
            message: `Se ha detectado contenido educativo relevante para ti: ${contenido.title}`,
            type: "educativo",
          });
          totalNotificados++;
        }
      }

      return { public: false, notified: totalNotificados };
    }
  } catch (error) {
    console.error("[Error] Error en analyzeAndNotifyContent:", error);
    throw error;
  }
};
