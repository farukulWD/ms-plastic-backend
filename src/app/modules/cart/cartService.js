import { ObjectId } from "mongodb";
import { User } from "../user/userModel.js";
import { Cart } from "./cartModel.js";
import {
  updateProductQuantities,
  calculateTotalPrice,
} from "../../utils/aggregation/index.js";
import AppError from "../../errors/AppError.js";
import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder.js";
import { cartSearchableFields } from "./cartConstance.js";

/******************add cart************************/
const makeCartIntoDB = async (userId, bodyData) => {
  const products = bodyData?.products;
  if (!userId) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Id is required");
  }
  if (products.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Products cannot be empty");
  }

  const userFind = await User.findOne({ _id: new ObjectId(userId) });
  if (!userFind) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not found");
  }

  const cart = await Cart.create(bodyData);

  await updateProductQuantities(cart._id, products, "add");

  cart.totalPrice = await calculateTotalPrice(cart._id);
  await cart.save();

  return cart;
};

/******************gets all carts************************/
const getCartsFromDB = async (query) => {
  const cartQuery = new QueryBuilder(
    Cart.find().populate("products.product").populate({
      path: "user",
      select: "name  _id role profilePicture ",
    }),
    query
  )
    .search(cartSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const pagination = await cartQuery.countTotal();
  const carts = await cartQuery.modelQuery;

  return {
    carts,
    pagination,
  };
};
/******************get single cart************************/
const getSingleCartFromDB = async (id) => {
  if (!id) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cart Id is required");
  }
  const result = await Cart.findById({ _id: new ObjectId(id) }).populate({
    path: "products.product",
    select: "_id code name price company groupName",
  });
  return result;
};

/******************edit cart************************/

const editCart = async (id, product) => {
  if (!product) {
    throw new AppError(httpStatus.BAD_REQUEST, "Product is Required");
  }

  const cart = await Cart.findOne({ _id: new ObjectId(id) });
  if (!cart) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cart not found");
  }
  if (cart.isOrder) {
    throw new AppError(httpStatus.BAD_REQUEST, "The cart is all ready ordered");
  }
  const filter = { _id: new ObjectId(id) };
  await updateProductQuantities(cart?._id, product.products, "edit");
  const result = await Cart.findOneAndUpdate(filter, product, {
    new: true,
  });

  const updatedCart = await calculateTotalPrice(cart._id);
  cart.totalPrice = updatedCart;
  await cart.save();
  return updatedCart;
};

/******************Delete cart************************/

const deleteCartFromDB = async (cartId) => {
  if (!cartId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cart Id is required");
  }

  const findCart = await Cart.findOne({ _id: new ObjectId(cartId) });

  if (!findCart) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cart not found");
  }
  if (findCart.isOrder) {
    throw new AppError(httpStatus.BAD_REQUEST, "The cart is all ready ordered");
  }
  await updateProductQuantities(findCart?._id, findCart.products, "delete");

  const result = await Cart.findOneAndDelete({ _id: new ObjectId(cartId) });
  return result;
};

export const CartServices = {
  makeCartIntoDB,
  getCartsFromDB,
  deleteCartFromDB,
  editCart,
  getSingleCartFromDB,
};
