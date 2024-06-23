import { CartServices } from "./cartService.js";

const addCart = async (req, res, next) => {
  try {
    const { userId, products } = req.body;
    const result = await CartServices.makeCartIntoDB(userId, products);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
    next(error);
  }
};

export const CartControllers = {
  addCart,
};
