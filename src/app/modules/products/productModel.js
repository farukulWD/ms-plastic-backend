import { Schema } from "mongoose";

export const productSchema = new Schema(
  {
    code: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: true,
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

    netPrice: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = model("Product", productSchema);
