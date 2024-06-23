import { ObjectId } from "mongodb";
import { User } from "../user/userModel.js";
import { Cart } from "./cartModel.js";

const makeCartIntoDB = async (userId, products) => {
  if (!userId) {
    throw new Error("User Id is required");
  }
  if (products.length < 0) {
    throw new Error("Product can not be empty");
  }

  const user = User.findOne({ _id: new ObjectId(userId) });
  if (!user) {
    throw new Error("User not found");
  }
  const data = { userId, products };
  const result = await Cart.create(data);
  return result;
};

export const CartServices = {
  makeCartIntoDB,
};
