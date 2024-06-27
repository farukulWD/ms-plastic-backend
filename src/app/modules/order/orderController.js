import catchAsync from "../../utils/catchAsync.js";
import { OrderServices } from "./orderService.js";
import sendResponse from "../../utils/sendResponse.js";
import httpStatus from "http-status";

/*****************add order**************** */
const addOrder = catchAsync(async (req, res) => {
  const orderData = req.body;
  const result = await OrderServices.makeOrder(orderData);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Order is created",
    success: true,
    data: result,
  });
});

/**-------------------get orders------------------- */
const getOrders = catchAsync(async (req, res) => {
  const result = await OrderServices.getOrdersFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Get orders success",
    success: true,
    data: result,
  });
});

export const OrderControllers = {
  addOrder,
  getOrders,
};
