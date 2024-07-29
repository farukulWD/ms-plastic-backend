import { Router } from "express";
import { ProductControllers } from "./productController.js";
import validateRequest from "../../middleware/validateRequest.js";
import { productValidation } from "./productValidation.js";
import { user_role } from "../user/userModel.js";
import auth from "../../middleware/auth.js";

const router = Router();

router.post(
  "/add-product",
  auth(user_role.admin, user_role.master),
  validateRequest(productValidation.createProductValidation),
  ProductControllers.addProduct
);
router.get(
  "/get-products",
  auth(user_role.admin, user_role.master),
  ProductControllers.getProducts
);
router.get(
  "/get-single-product/:id",
  auth(user_role.admin, user_role.master),
  ProductControllers.getSingleProduct
);
router.patch(
  "/edit-product/:id",
  auth(user_role.admin, user_role.master),
  validateRequest(productValidation.updateProductValidation),
  ProductControllers.editProduct
);
router.delete(
  "/delete-product",
  auth(user_role.admin, user_role.master),
  ProductControllers.deleteProduct
);

export const productRoutes = router;
