import { z } from "zod";
import mongoose from "mongoose";

// Validation schema for a single product in the cart
const cartProductValidation = z.object({
  product: z.string(),
  quantity: z
    .number()
    .min(1, { message: "Quantity must be at least 1" })
    .int({ message: "Quantity must be an integer" }),
});

// Validation schema for creating a cart
const createCartValidation = z.object({
  body: z.object({
    products: z.array(cartProductValidation).nonempty({
      message: "Products array cannot be empty",
    }),
    cartName: z.string().min(1, { message: "Cart name is required" }),
    user: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid user ID",
    }),
    totalPrice: z
      .number()
      .min(0, { message: "Total price must be non-negative" })
      .optional(),
    isOrder: z.boolean().optional(),
    groupName: z.enum([
      "pride",
      "tel-household",
      "tel-furniture",
      "pacific",
      "prominent",
    ]),
  }),
});

// Validation schema for updating a cart
const updateCartValidation = z.object({
  body: z.object({
    products: z.array(cartProductValidation).optional(),
    cartName: z.string().min(1).optional(),
    user: z
      .string()
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid user ID",
      })
      .optional(),
    totalPrice: z.number().min(0).optional(),
    isOrder: z.boolean().optional(),
    groupName: z
      .enum(["pride", "tel-household", "tel-furniture", "pacific", "prominent"])
      .optional(),
  }),
});

export const cartValidation = {
  createCartValidation,
  updateCartValidation,
};
