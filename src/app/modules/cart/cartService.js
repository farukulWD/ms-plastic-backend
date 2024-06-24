import { ObjectId } from "mongodb";
import { User } from "../user/userModel.js";
import { Cart } from "./cartModel.js";
import {
  updateProductQuantities,
  calculateTotalPrice,
} from "../../utils/aggregation/index.js";

const makeCartIntoDB = async (userId, products) => {
  if (!userId) {
    throw new Error("User Id is required");
  }
  if (products.length === 0) {
    throw new Error("Products cannot be empty");
  }

  const userFind = await User.findOne({ _id: new ObjectId(userId) });
  if (!userFind) {
    throw new Error("User not found");
  }

  const data = { user: userId, products };

  const cart = await Cart.create(data);

  await updateProductQuantities(cart._id, products, "add");

  cart.totalPrice = await calculateTotalPrice(cart._id);
  await cart.save();

  return cart;
};

const getCartsFromDB = async () => {
  const result = await Cart.find({})
    .populate("products.product")
    .populate("user");
  return result;
};

const editCart = async (id, product) => {
  if (!product) {
    throw new Error("Product is Required");
  }

  const cart = await Cart.findOne({ _id: new ObjectId(id) });
  if (!cart) {
    throw new Error("Cart not found");
  }
  const filter = { _id: new ObjectId(id) };
  await updateProductQuantities(cart?._id, product.products, "edit");
  const result = await Cart.findOneAndUpdate(filter, product, {
    upsert: true,
    new: true,
  });

  const updatedCart = await calculateTotalPrice(cart._id);
  cart.totalPrice = updatedCart;
  await cart.save();
  return updatedCart;
};

const deleteCartFromDB = async (cartId) => {
  if (!cartId) {
    throw new Error("Cart Id is required");
  }

  const findCart = await Cart.findOne({ _id: new ObjectId(cartId) });

  if (!findCart) {
    throw new Error("Cart not found");
  }
  await updateProductQuantities(findCart?._id, findCart.products, "delete");

  const result = await Cart.findOneAndDelete({ _id: new ObjectId(cartId) });
  return result;
};

export const CartServices = {
  makeCartIntoDB,
  getCartsFromDB,
  deleteCartFromDB,
  editCart,
};
