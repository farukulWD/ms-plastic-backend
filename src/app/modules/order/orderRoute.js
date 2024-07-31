import { Router } from "express";
import { OrderControllers } from "./orderController.js";
import auth from "../../middleware/auth.js";
import { user_role } from "../user/userModel.js";
import validateRequest from "../../middleware/validateRequest.js";
import { orderValidation } from "./orderValidation.js";

const router = Router();
router.post(
  "/add-order",
  auth(user_role.admin, user_role.master),
  validateRequest(orderValidation.createOrderValidation),
  OrderControllers.addOrder
);
router.get(
  "/get-orders",
  auth(user_role.admin, user_role.master),
  OrderControllers.getOrders
);
router.get(
  "/get-single-order/:id",
  auth(user_role.admin, user_role.master),
  OrderControllers.getSingleOrder
);
router.patch(
  "/edit-order/:id",
  auth(user_role.admin, user_role.master),
  validateRequest(orderValidation.updateOrderValidation),
  OrderControllers.editOrder
);

export const orderRoutes = router;
