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
  const query = req.query;
  const result = await OrderServices.getOrdersFromDB(query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Get orders success",
    success: true,
    data: result,
  });
});

/*------------------get single order--------------*/
const getSingleOrder = catchAsync(async (req, res) => {
  const id = req.params;
  const result = await OrderServices.getSingleOrderFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Order get success",
    success: true,
    data: result,
  });
});

/*------------------Edit single order--------------*/

const editOrder = catchAsync(async (req, res) => {
  const id = req.params;
  const data = req.body;

  const result = await OrderServices.editSingleOrder(id, data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Order updated success",
    success: true,
    data: result,
  });
});

export const OrderControllers = {
  addOrder,
  getOrders,
  getSingleOrder,
  editOrder,
};
