import { ObjectId } from "mongodb";
import AppError from "../../errors/AppError.js";
import httpStatus from "http-status";
import { User } from "../user/userModel.js";
import { Order } from "./orderModel.js";
import QueryBuilder from "../../builder/QueryBuilder.js";

/*****************make order**************** */
const makeOrder = async (orderData) => {
  const userId = orderData.addedBy;
  if (!userId) {
    throw new AppError(httpStatus.BAD_REQUEST, "User id is required");
  }
  if (!orderData) {
    throw new AppError(httpStatus.BAD_REQUEST, "Order Data is required");
  }
  const existOrder = await Order.findOne({
    cart: orderData?.cart,
  });

  if (existOrder) {
    throw new AppError(httpStatus.BAD_REQUEST, "This order already created");
  }
  const user = await User.findOne({ _id: new ObjectId(userId) });
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not found");
  }
  const result = Order.create(orderData);
  return result;
};

/*-------------------Get Orders-------------------------- */

const getOrdersFromDB = async (query) => {
  const orderQuery = new QueryBuilder(
    Order.find(filter).populate("cart").populate("addedBy"),
    query
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const orders = await orderQuery.modelQuery;
  const pagination = await orderQuery.countTotal();

  return {
    orders,
    pagination,
  };
};

/*--------------------get single order-------------*/
const getSingleOrderFromDB = async (id) => {
  if (!id) {
    throw new AppError(httpStatus.BAD_REQUEST, "Id is required");
  }

  const order = await Order.findOne({ _id: new ObjectId(id) })
    .populate("cart")
    .populate("addedBy");
  if (!order) {
    throw new AppError(httpStatus.BAD_REQUEST, "Order not found");
  }
  return order;
};

/*--------------------Edit single order -------------*/

const editSingleOrder = async (id, orderData) => {
  if (!id) {
    throw new AppError(httpStatus.BAD_REQUEST, "Id is required");
  }
  const findOrder = await Order.findOne({ _id: new ObjectId(id) });
  if (!findOrder) {
    throw new AppError(httpStatus.BAD_REQUEST, "Order is not found");
  }
  if (findOrder.isDelivered) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "The Order is all ready delivered"
    );
  }
  const { totalPrice, isDelivered } = orderData;
  const updateData = {};

  if (totalPrice !== undefined) {
    updateData.totalPrice = totalPrice;
  }
  if (isDelivered !== undefined) {
    updateData.isDelivered = isDelivered;
  }

  const filter = { _id: new ObjectId(findOrder?._id) };
  const result = await Order.findOneAndUpdate(filter, updateData, {
    new: true,
  });

  return result;
};

export const OrderServices = {
  makeOrder,
  getOrdersFromDB,
  getSingleOrderFromDB,
  editSingleOrder,
};
