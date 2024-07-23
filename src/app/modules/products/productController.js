import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync.js";
import { ProductServices } from "./productService.js";
import AppError from "../../errors/AppError.js";
import sendResponse from "../../utils/sendResponse.js";

/*----------------Add product-----------------*/

const addProduct = catchAsync(async (req, res) => {
  const product = req.body;
  if (product && Object.keys(product).length > 0) {
    const result = await ProductServices.addProductIntoDB(product);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: "Product is created",
      success: true,
      data: result,
    });
  } else {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Product is required and can not be empty"
    );
  }
});

/*-----------------Get All Products---------------*/

const getProducts = catchAsync(async (req, res) => {
  const query = req.query;

  const result = await ProductServices.getProductsFromDB(query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Get Products success",
    success: true,
    data: result,
  });
});

const getSingleProduct = catchAsync(async (req, res) => {
  const id = req.params;
  const result = await ProductServices.getSingleProductFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Product get success",
    data: result,
    success: true,
  });
});

/*---------------------Edit Product-------------------*/

const editProduct = async (req, res, next) => {
  const id = req.params;
  const product = req.body;
  if (product && Object.keys(product).length > 0) {
    const result = await ProductServices.editProduct(id, product);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Edit Product has been success",
      success: true,
      data: result,
    });
  } else {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Product is required and can not be empty"
    );
  }
};

/*--------------------Delete Product--------------------*/

const deleteProduct = async (req, res, next) => {
  const id = req.body;

  if (!id) {
    throw new AppError(httpStatus.BAD_REQUEST, "Id is required");
  }
  const result = await ProductServices.deleteProductFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "The Product has been deleted",
    success: true,
  });
};

export const ProductControllers = {
  addProduct,
  getProducts,
  editProduct,
  getSingleProduct,
  deleteProduct,
};
