import { ProductServices } from "./productService.js";

const addProduct = async (req, res, next) => {
  try {
    const product = req.body;
    if (product && Object.keys(product).length > 0) {
      const result = await ProductServices.addProductIntoDD(product);
      res.status(200).json({ success: true, data: result });
    } else {
      res
        .status(400)
        .json({
          success: false,
          message: "Product is required and can not be empty",
        });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const ProductControllers = {
  addProduct,
};
