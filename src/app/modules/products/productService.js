import { Product } from "./productModel.js";

const addProductIntoDD = async (product) => {
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

export const ProductServices = {
  addProductIntoDD,
};
