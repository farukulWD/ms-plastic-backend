import { ObjectId } from "mongodb";
import { User } from "../user/userModel.js";
import { Cart } from "./cartModel.js";

const makeCartIntoDB = async (userId, products) => {
  if (!userId) {
    throw new Error("User Id is required");
  }
  if (products.length === 0) {
    throw new Error("Product can not be empty");
  }

  const userFind = await User.findOne({ _id: new ObjectId(userId) });
  if (!userFind) {
    throw new Error("User not found");
  }
  const data = { user: userId, products };
  const result = await Cart.create(data);
  return result;
};

const getCartsFromDB = async () => {
  const result = await Cart.find({})
    .populate("products.product")
    .populate("user");
  return result;
};

const deleteCartFromDB = async (cartId) => {
  if (!cartId) {
    throw new Error("Cart Id is required");
  }

  const findCart = await Cart.findOne({ _id: new ObjectId(cartId) });

  if (!findCart) {
    throw new Error("Cart not found");
  }

  const result = await Cart.findOneAndDelete({ _id: new ObjectId(cartId) });
  return result;
};

export const CartServices = {
  makeCartIntoDB,
  getCartsFromDB,
  deleteCartFromDB,
};
