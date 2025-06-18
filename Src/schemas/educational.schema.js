import { z } from "zod";

export const educationalContentSchema = z.object({
  title: z
    .string()
    .min(3, "El título es requerido y debe tener al menos 3 caracteres."),
  description: z.string().optional(),
  fileUrl: z.string().url("La URL del archivo no es válida."),
  fileType: z.enum(["video", "image", "pdf", "article"]),
  relatedSymptoms: z.array(z.string()).optional(),
  treatmentStage: z
    .enum(["inicio", "intermedio", "final", "indefinido"])
    .optional(),
  clinicalTags: z.array(z.string()).optional(),
  isPublic: z.boolean().optional(),
});

export const educationalContentUpdateSchema =
  educationalContentSchema.partial();
