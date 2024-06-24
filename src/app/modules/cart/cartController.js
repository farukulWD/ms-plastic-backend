import { CartServices } from "./cartService.js";

const addCart = async (req, res, next) => {
  try {
    const { user, products } = req.body;
    const result = await CartServices.makeCartIntoDB(user, products);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
    next(error);
  }
};

const getCarts = async (req, res) => {
  try {
    const result = await CartServices.getCartsFromDB();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
    next(error);
  }
};
const deleteCart = async (req, res, next) => {
  try {
    const id = req.body;
    await CartServices.deleteCartFromDB(id);
    res
      .status(200)
      .json({ success: true, message: "The cart has been deleted" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
    next(error);
  }
};

const editCart = async (req, res, next) => {
  try {
    const id = req.params;
    const product = req.body;
    await CartServices.editCart(id, product);
    res.status(200).json({ success: true, message: "Update has been success" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
    next(error);
  }
};

export const CartControllers = {
  addCart,
  getCarts,
  deleteCart,
  editCart,
};
