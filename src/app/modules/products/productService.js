import { ObjectId } from "mongodb";
import { Product } from "./productModel.js";
import { User } from "../user/userModel.js";

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
  if (!product.addedBy) {
    throw new Error("Product addedBy is required");
  }

  /*************************get user********************/
  const user = await User.findById(product.addedBy);
  if (!user) {
    throw new Error("User not found");
  }
  const result = await Product.create(product);
  user.addedProducts.push(result._id);
  await user.save();

  return result;
};

const getProductsFromDB = async () => {
  const result = Product.find({}).populate("addedBy");
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

const deleteProductFromDB = async (id) => {
  if (!id) {
    throw new Error("Id is required");
  }

  const product = await Product.findOne({ _id: new ObjectId(id) });
  if (product) {
    const result = Product.findOneAndDelete({ _id: new ObjectId(id) });
    return result;
  } else {
    throw new Error("Product is not found");
  }
};

export const ProductServices = {
  addProductIntoDB,
  editProduct,
  deleteProductFromDB,
  getProductsFromDB,
};
