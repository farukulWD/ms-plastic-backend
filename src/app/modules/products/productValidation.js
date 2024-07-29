import mongoose from "mongoose";
import { z } from "zod";

const createProductValidation = z.object({
  body: z.object({
    code: z
      .string()
      .min(1, { message: "Code is required" })
      .max(10, { message: "Code is too long" }),
    name: z
      .string()
      .min(1, { message: "Name is required" })
      .max(255, { message: "Name is too long" }),
    groupName: z.enum([
      "pride",
      "tel-household",
      "tel-furniture",
      "pacific",
      "prominent",
    ]),
    price: z.number().min(0, { message: "Price must be non-negative" }),
    company: z.enum(["RFL", "TEL"]),
    quantity: z
      .number()
      .min(1, { message: "Quantity must be at least 1" })
      .default(1),
    addedBy: z
      .instanceof(mongoose.Types.ObjectId)
      .refine((value) => mongoose.Types.ObjectId.isValid(value), {
        message: "Invalid ObjectId",
      }),
  }),
});

const updateProductValidation = z.object({
  body: z.object({
    code: z.string().min(1).max(10).optional(),
    name: z.string().min(1).max(255).optional(),
    groupName: z
      .enum(["pride", "tel-household", "tel-furniture", "pacific", "prominent"])
      .optional(),
    price: z.number().min(0).optional(),
    company: z.enum(["RFL", "TEL"]).optional(),
    quantity: z.number().min(1).optional(),
    addedBy: z
      .instanceof(mongoose.Types.ObjectId)
      .refine((value) => mongoose.Types.ObjectId.isValid(value), {
        message: "Invalid ObjectId",
      })
      .optional(),
  }),
});

export const productValidation = {
  createProductValidation,
  updateProductValidation,
};
