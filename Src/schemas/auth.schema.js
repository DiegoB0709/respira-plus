import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string({ required_error: "El nombre es requerido" })
    .min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z
    .string({ required_error: "El correo es requerido" })
    .email("Debe ser un correo válido"),
  phone: z.number({ required_error: "El teléfono es requerido" }),
  password: z
    .string({ required_error: "La contraseña es requerida" })
    .min(6, "Debe tener al menos 6 caracteres"),
  registrationToken: z
    .string({ required_error: "El token es obligatorio" })
    .min(10, "El token es demasiado corto"),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "El correo es requerido" })
    .email("Debe ser un correo válido"),
  password: z
    .string({ required_error: "La contraseña es requerida" })
    .min(6, "Debe tener al menos 6 caracteres"),
});

export const tokenSchema = z.object({
  doctorId: z.string().optional(),
});
