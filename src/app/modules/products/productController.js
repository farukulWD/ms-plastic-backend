import { ProductServices } from "./productService.js";

const addProduct = async (req, res, next) => {
  try {
    const product = req.body;
    if (product && Object.keys(product).length > 0) {
      const result = await ProductServices.addProductIntoDB(product);
      res.status(200).json({ success: true, data: result });
    } else {
      res.status(400).json({
        success: false,
        message: "Product is required and can not be empty",
      });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
    next(error);
  }
};

const editProduct = async (req, res, next) => {
  try {
    const id = req.params;
    const product = req.body;
    if (product && Object.keys(product).length > 0) {
      const result = await ProductServices.editProduct(id, product);
      res.status(200).json({ success: true, data: result });
    } else {
      res.status(400).json({
        success: false,
        message: "Product is required and can not be empty",
      });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const id = req.body;
    if (id) {
      const result = await ProductServices.deleteProductFromDB(id);
      if (result) {
        res
          .status(200)
          .json({ success: true, message: "The Product has been deleted" });
      }
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
    next(error);
  }
};

export const ProductControllers = {
  addProduct,
  editProduct,
  deleteProduct,
};
