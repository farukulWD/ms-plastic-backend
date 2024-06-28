import { ObjectId } from "mongodb";
import AppError from "../../errors/AppError.js";
import httpStatus from "http-status";
import { User } from "../user/userModel.js";
import { Order } from "./orderModel.js";
import buildFilter from "../../utils/buildFilter.js";

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

const getOrdersFromDB = async (query) => {
  const { page, limit, isDelivered, addedBy, sort, ...rest } = query;
  const filter = buildFilter(rest);

  if (isDelivered) {
    filter.isDelivered = isDelivered;
  }
  if (addedBy) {
    filter.addedBy = new ObjectId(addedBy);
  }

  const pageNumber = parseInt(page, 10) || 1;
  const limitNumber = parseInt(limit, 10) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const sortOption = {
    updatedAt: sort === "newest" ? -1 : 1,
  };

  const orders = await Order.find(filter)
    .populate("cart")
    .populate("addedBy")
    .skip(skip)
    .limit(limit)
    .sort(sortOption);

  const totalOrder = await Order.countDocuments(filter);
  const totalPages = Math.ceil(totalOrder / limitNumber);

  return {
    orders,
    pagination: {
      total: totalOrder,
      totalPages,
      currentPage: pageNumber,
    },
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
