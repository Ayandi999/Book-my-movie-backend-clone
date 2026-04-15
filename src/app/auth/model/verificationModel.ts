import { z } from "zod";

const RegisterSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().nullable().optional(),
  email: z.email(),
  password: z.string().min(6),
});

const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export { RegisterSchema, LoginSchema };
