import mongoose, { Schema, model } from "mongoose";

const productsSchema = new Schema(
  {
    product: {
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
  { _id: false }
);

export const cartSchema = new Schema(
  {
    products: [productsSchema],
    cartName: {
      type: String,
      require: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    isOrder: {
      type: Boolean,
      default: false,
    },
    groupName: {
      type: String,
      enum: ["pride", "tel-household", "tel-furniture", "pacific", "prominent"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
cartSchema.pre("save", async function (next) {
  if (this.isModified("products")) {
    const productIds = this.products.map((p) => p.product);
    const products = await mongoose
      .model("Product")
      .find({ _id: { $in: productIds } });

    this.totalPrice = this.products.reduce((acc, cartProduct) => {
      const product = products.find((p) => p._id.equals(cartProduct.product));
      return acc + product.price * cartProduct.quantity;
    }, 0);
  }
  next();
});

export const Cart = model("Cart", cartSchema);
