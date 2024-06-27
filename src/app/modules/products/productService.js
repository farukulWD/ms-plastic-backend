import { ObjectId } from "mongodb";
import { Product } from "./productModel.js";
import { User } from "../user/userModel.js";
import AppError from "../../errors/AppError.js";
import httpStatus from "http-status";
import buildFilter from "../../utils/buildFilter.js";

/**------------------add product------------------------ */

const addProductIntoDB = async (product) => {
  if (!product.code) {
    throw new AppError(httpStatus.BAD_REQUEST, "Product Code is required");
  }
  if (!product.name) {
    throw new AppError(httpStatus.BAD_REQUEST, "Product Name is required");
  }
  if (!product.groupName) {
    throw new AppError(httpStatus.BAD_REQUEST, "Product Group is required");
  }
  if (!product.price) {
    throw new AppError(httpStatus.BAD_REQUEST, "Product Price is required");
  }
  if (!product.company) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Product company name is required"
    );
  }
  if (!product.addedBy) {
    throw new AppError(httpStatus.BAD_REQUEST, "Product addedBy is required");
  }

  const user = await User.findById(product.addedBy);
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not found");
  }
  const result = await Product.create(product);
  user.addedProducts.push(result._id);
  await user.save();

  return result;
};

/**--------------------get products------------------- */

const getProductsFromDB = async (query) => {
  const { page, limit, ...rest } = query;

  const filter = buildFilter(rest);

  const pageNumber = parseInt(page, 10) || 1;
  const limitNumber = parseInt(limit, 10) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const products = await Product.find(filter)
    .populate("addedBy")
    .limit(limit)
    .skip(skip);

  const totalProducts = await Product.countDocuments(filter);
  const totalPages = Math.ceil(totalProducts / limitNumber);

  return {
    products,
    pagination: {
      total: totalProducts,
      totalPages,
      currentPage: pageNumber,
    },
  };
};

/**--------------------edit products------------------- */
const editProduct = async (id, product) => {
  if (!id) {
    throw new AppError(httpStatus.BAD_REQUEST, "Id is required");
  }
  if (!product.code) {
    throw new AppError(httpStatus.BAD_REQUEST, "Product Code is required");
  }
  if (!product.name) {
    throw new AppError(httpStatus.BAD_REQUEST, "Product Name is required");
  }
  if (!product.groupName) {
    throw new AppError(httpStatus.BAD_REQUEST, "Product Group is required");
  }
  if (!product.price) {
    throw new AppError(httpStatus.BAD_REQUEST, "Product Price is required");
  }
  if (!product.company) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Product company name is required"
    );
  }

  const findProduct = await Product.findOne({ _id: new ObjectId(id) });
  const filter = { _id: new ObjectId(id) };
  const update = product;

  if (findProduct) {
    const result = await Product.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true,
    });
    return result;
  } else {
    throw new AppError(httpStatus.BAD_REQUEST, "Product not found");
  }
};

/**--------------------edit products------------------- */

const deleteProductFromDB = async (id) => {
  if (!id) {
    throw new AppError(httpStatus.BAD_REQUEST, "Id is required");
  }

  const product = await Product.findOne({ _id: new ObjectId(id) });
  if (product) {
    const result = Product.findOneAndDelete({ _id: new ObjectId(id) });
    return result;
  } else {
    throw new AppError(httpStatus.BAD_REQUEST, "Product is not found");
  }
};

export const ProductServices = {
  addProductIntoDB,
  editProduct,
  deleteProductFromDB,
  getProductsFromDB,
};
