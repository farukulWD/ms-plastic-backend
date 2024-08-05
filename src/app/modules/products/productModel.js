import mongoose, { Schema, model } from "mongoose";

export const productSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    groupName: {
      type: String,
      enum: ["pride", "tel-household", "tel-furniture", "pacific", "prominent"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    company: {
      type: String,
      enum: ["RFL", "TEL"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    addedBy: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Product = model("Product", productSchema);
