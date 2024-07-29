import mongoose from "mongoose";
import { z } from "zod";

const createUserValidation = z.object({
  body: z.object({
    name: z
      .string()
      .min(1)
      .max(30)
      .refine((value) => /^[A-Z]/.test(value), {
        message: "Name must be start with capital latter",
      })
      .optional(),
    email: z.string().email().optional(),
    password: z.string().min(4).max(20).optional(),

    mobile: z
      .string()
      .min(11, { message: "Mininum 11 characters" })
      .max(14, { message: "Max 14 characters" })
      .optional(),
    role: z.enum(["user", "admin", "master", "manger"]).optional(),
    isDeleted: z.boolean().default(false).optional(),
    passwordChangedAt: z.date().optional(),
    addedProducts: z.array(z.instanceof(mongoose.Types.ObjectId)).optional(),
  }),
});

export const userValidation = {
  createUserValidation,
};
