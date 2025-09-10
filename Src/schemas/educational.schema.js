import { z } from "zod";

export const educationalContentSchema = z.object({
  title: z
    .string()
    .min(3, "El título es requerido y debe tener al menos 3 caracteres."),
  fileType: z.enum(["image", "video"]),
  description: z.string().optional(),
  relatedSymptoms: z.string().optional(),
  treatmentStage: z
    .enum(["inicio", "intermedio", "final", "indefinido"])
    .optional(),
  clinicalTags: z.string().optional(),
  isPublic: z.union([z.boolean(), z.string()]).optional(),
});

export const educationalContentUpdateSchema =
  educationalContentSchema.partial();
