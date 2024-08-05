import { Router } from "express";
import { CartControllers } from "./cartController.js";
import auth from "../../middleware/auth.js";
import { user_role } from "../user/userModel.js";
import validateRequest from "../../middleware/validateRequest.js";
import { cartValidation } from "./cartValidation.js";

const router = Router();

router.post(
  "/add-cart",
  auth(user_role.admin, user_role.master),
  validateRequest(cartValidation.createCartValidation),
  CartControllers.addCart
);
router.get(
  "/get-carts",
  auth(user_role.admin, user_role.master),
  CartControllers.getCarts
);
router.get(
  "/get-single-cart/:id",
  auth(user_role.admin, user_role.master),
  CartControllers.getCart
);
router.delete(
  "/delete-cart",
  auth(user_role.admin, user_role.master),
  CartControllers.deleteCart
);
router.patch(
  "/edit-cart/:id",
  auth(user_role.admin, user_role.master),
  validateRequest(cartValidation.updateCartValidation),
  CartControllers.editCart
);

export const cartRoutes = router;
