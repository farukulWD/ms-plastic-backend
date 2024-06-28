import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { CartServices } from "./cartService.js";

/****************** create cart ************************/
const addCart = catchAsync(async (req, res, next) => {
  const data = req.body;
  const result = await CartServices.makeCartIntoDB(data?.user, data);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Added Product success",
    success: true,
    data: result,
  });
});

/****************** get all carts ************************/
const getCarts = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await CartServices.getCartsFromDB(query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Get carts success",
    success: true,
    data: result,
  });
});

/******************get single cart************************/
const getCart = catchAsync(async (req, res) => {
  const id = req.params;
  const result = await CartServices.getSingleCartFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Get cart success",
    success: true,
    data: result,
  });
});

/******************Delete cart************************/
const deleteCart = catchAsync(async (req, res, next) => {
  const id = req.body;
  await CartServices.deleteCartFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "The cart has been deleted",
    success: true,
  });
});
/******************edit cart************************/
const editCart = catchAsync(async (req, res, next) => {
  const id = req.params;
  const product = req.body;
  await CartServices.editCart(id, product);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Update has been success",
    success: true,
  });
});

export const CartControllers = {
  addCart,
  getCarts,
  deleteCart,
  editCart,
  getCart,
};
