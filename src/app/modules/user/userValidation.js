import { z } from "zod";

const createUserValidation = z.object({
  body: z.object({
    name: z
      .string()
      .min(1)
      .max(30)
      .refine((value) => /^[A-Z]/.test(value), {
        message: "must be start with capital latter",
      })
      .optional(),
    email: z.string().email().optional(),
    password: z
      .string()
      .min(4, { message: "Minimum 4 characters" })
      .max(20, { message: "Maximum 20 characters" })
      .optional(),

    mobile: z
      .string()
      .min(11, { message: "Mininum 11 characters" })
      .max(14, { message: "Max 14 characters" })
      .optional(),
    role: z.enum(["user", "admin", "master", "manger"]).optional(),
    isDeleted: z.boolean().default(false).optional(),
    passwordChangedAt: z.date().optional(),
    addedProducts: z.array(z.string().optional()),
  }),
});

export const userValidation = {
  createUserValidation,
};
