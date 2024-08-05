import { ObjectId } from "mongodb";
import { Product } from "./productModel.js";
import { User } from "../user/userModel.js";
import AppError from "../../errors/AppError.js";
import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder.js";
import { productSearchableFields } from "./productConstance.js";

/**------------------add product------------------------ */

const addProductIntoDB = async (product) => {
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
  const productQuery = new QueryBuilder(
    Product.find().populate("addedBy"),
    query
  )
    .search(productSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const products = await productQuery.modelQuery;
  const pagination = await productQuery.countTotal();

  return {
    products,
    pagination,
  };
};

/*------------------Get single product-------------- */

const getSingleProductFromDB = async (id) => {
  if (!id) {
    throw new AppError(httpStatus.BAD_REQUEST, "Id is Required");
  }

  const product = await Product.findOne({ _id: new ObjectId(id) });
  if (!product) {
    throw new AppError(httpStatus.BAD_REQUEST, "Product not found");
  }

  return product;
};

/**--------------------edit products------------------- */

const editProduct = async (id, product) => {
  if (!id) {
    throw new AppError(httpStatus.BAD_REQUEST, "Id is required");
  }

  const findProduct = await Product.findOne({ _id: new ObjectId(id) });
  const filter = { _id: new ObjectId(id) };
  const update = product;

  if (findProduct) {
    const result = await Product.findOneAndUpdate(filter, update, {
      new: true,
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
  getSingleProductFromDB,
};
