import { z } from "zod";
import mongoose from "mongoose";

// Validation schema for creating an order
const createOrderValidation = z.object({
  body: z.object({
    isDelivered: z.boolean().default(false),
    cart: z.string({ message: "Cart id is rquired" }),
    totalPrice: z
      .number()
      .min(0, { message: "Total price must be non-negative" }),
    addedBy: z.string(),
    groupName: z.enum([
      "pride",
      "tel-household",
      "tel-furniture",
      "pacific",
      "prominent",
    ]),
  }),
});

// Validation schema for updating an order
const updateOrderValidation = z.object({
  body: z.object({
    isDelivered: z.boolean().optional(),
    cart: z.string().optional(),
    totalPrice: z.number().min(0).optional(),
    addedBy: z.string().optional(),
    groupName: z
      .enum(["pride", "tel-household", "tel-furniture", "pacific", "prominent"])
      .optional(),
  }),
});

export const orderValidation = {
  createOrderValidation,
  updateOrderValidation,
};
