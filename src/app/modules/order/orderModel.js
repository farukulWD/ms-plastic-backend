import mongoose, { Schema, model } from "mongoose";

export const orderSchema = Schema(
  {
    isDelivered: {
      type: Boolean,
      default: false,
    },
    cart: {
      type: mongoose.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    addedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    groupName: {
      type: String,
      enum: ["pride", "tel-household", "tel-furniture", "pacific", "prominent"],
      required: true,
    },
  },
  {
    Timestamp: true,
  }
);

export const Order = model("Order", orderSchema);
