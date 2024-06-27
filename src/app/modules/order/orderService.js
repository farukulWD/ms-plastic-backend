import { ObjectId } from "mongodb";
import AppError from "../../errors/AppError.js";
import httpStatus from "http-status";
import { User } from "../user/userModel.js";
import { Order } from "./orderModel.js";

/*****************make order**************** */
const makeOrder = async (orderData) => {
  const userId = orderData.addedBy;
  if (!userId) {
    throw new AppError(httpStatus.BAD_REQUEST, "User id is required");
  }
  if (!orderData) {
    throw new AppError(httpStatus.BAD_REQUEST, "Order Data is required");
  }
  const user = await User.findOne({ _id: new ObjectId(userId) });
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not found");
  }
  const result = Order.create(orderData);
  return result;
};

/*-------------------Get Orders-------------------------- */

const getOrdersFromDB = async () => {
  const result = await Order.find({}).populate("cart").populate("addedBy");
  return result;
};

export const OrderServices = {
  makeOrder,
  getOrdersFromDB,
};
