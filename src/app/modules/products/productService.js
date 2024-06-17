import { ObjectId } from "mongodb";
import { Product } from "./productModel.js";

const addProductIntoDB = async (product) => {
  if (!product.code) {
    throw new Error("Product Code is required");
  }
  if (!product.name) {
    throw new Error("Product Name is required");
  }
  if (!product.groupName) {
    throw new Error("Product Group is required");
  }
  if (!product.price) {
    throw new Error("Product Price is required");
  }
  if (!product.company) {
    throw new Error("Product company name is required");
  }

  const result = await Product.create(product);
  return result;
};

const editProduct = async (id, product) => {
  if (!id) {
    throw new Error("Id is required");
  }
  if (!product.code) {
    throw new Error("Product Code is required");
  }
  if (!product.name) {
    throw new Error("Product Name is required");
  }
  if (!product.groupName) {
    throw new Error("Product Group is required");
  }
  if (!product.price) {
    throw new Error("Product Price is required");
  }
  if (!product.company) {
    throw new Error("Product company name is required");
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
    throw new Error("Product not found");
  }
};

export const ProductServices = {
  addProductIntoDB,
  editProduct,
};
