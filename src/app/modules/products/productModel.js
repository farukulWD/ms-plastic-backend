import mongoose, { Schema, model } from "mongoose";

export const productSchema = new Schema(
  {
    code: {
      type: String,
      require: true,
      unique: true,
    },
    name: {
      type: String,
      require: true,
    },
    image: {
      type: String,
    },
    groupName: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    company: {
      type: String,
      require: true,
    },
    quantity: {
      type: Number,
      require: true,
      default: 1,
    },
    addedBy: {
      type: mongoose.Types.ObjectId,
      require: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Product = model("Product", productSchema);
