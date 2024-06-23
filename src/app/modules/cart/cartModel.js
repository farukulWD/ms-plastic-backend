import mongoose, { Schema, model } from "mongoose";

export const cartSchema = new Schema(
  {
    products: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    userId: {
      type: mongoose.Types.ObjectId,
      rel: "User",
      require: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
cartSchema.pre("save", async function (next) {
  if (this.isModified("products")) {
    const productIds = this.products.map((p) => p.productId);
    const products = await mongoose
      .model("Product")
      .find({ _id: { $in: productIds } });

    this.totalPrice = this.products.reduce((acc, cartProduct) => {
      const product = products.find((p) => p._id.equals(cartProduct.productId));
      return acc + product.price * cartProduct.quantity;
    }, 0);
  }
  next();
});

export const Cart = model("Cart", cartSchema);
