import { ObjectId } from "mongodb";
import mongoose from "mongoose";

export const calculateTotalPrice = async (cartId) => {
  const result = await mongoose.model("Cart").aggregate([
    { $match: { _id: new ObjectId(cartId) } },
    { $unwind: "$products" },
    {
      $lookup: {
        from: "products",
        localField: "products.product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },
    {
      $group: {
        _id: "$_id",
        totalPrice: {
          $sum: {
            $multiply: ["$products.quantity", "$productDetails.price"],
          },
        },
      },
    },
  ]);

  return result.length > 0 ? result[0].totalPrice : 0;
};

export const updateProductQuantities = async (
  cartId,
  newProducts,
  operation
) => {
  const cart = await mongoose
    .model("Cart")
    .findById(cartId)
    .populate("products.product");

  if (!cart) {
    throw new Error("Cart not found");
  }

  const currentProducts = cart.products;

  let updates = [];

  switch (operation) {
    case "add":
      updates = newProducts.map((product) => ({
        updateOne: {
          filter: { _id: product.product },
          update: { $inc: { quantity: -product.quantity } },
        },
      }));
      break;

    case "edit":
      const productDifferences = newProducts.map((newProduct) => {
        const existingProduct = currentProducts.find((p) =>
          p.product.equals(newProduct.product)
        );

        const oldQuantity = existingProduct ? existingProduct.quantity : 0;
        const newQuantity = newProduct.quantity;
        return {
          product: newProduct.product,
          difference: newQuantity - oldQuantity,
        };
      });

      updates = productDifferences.map(({ product, difference }) => ({
        updateOne: {
          filter: { _id: product },
          update: { $inc: { quantity: -difference } },
        },
      }));
      break;

    case "delete":
      updates = currentProducts.map((product) => ({
        updateOne: {
          filter: { _id: product.product._id },
          update: { $inc: { quantity: product.quantity } },
        },
      }));
      break;

    default:
      throw new Error("Invalid operation");
  }

  await mongoose.model("Product").bulkWrite(updates);
};
