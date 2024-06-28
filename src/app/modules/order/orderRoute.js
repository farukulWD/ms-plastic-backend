import { Router } from "express";
import { OrderControllers } from "./orderController.js";

const router = Router();
router.post("/add-order", OrderControllers.addOrder);
router.get("/get-orders", OrderControllers.getOrders);
router.get("/get-single-order/:id", OrderControllers.getSingleOrder);
router.patch("/edit-order/:id", OrderControllers.editOrder);

export const orderRoutes = router;
