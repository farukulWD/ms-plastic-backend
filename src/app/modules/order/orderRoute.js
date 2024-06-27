import { Router } from "express";
import { OrderControllers } from "./orderController.js";

const router = Router();
router.post("/add-order", OrderControllers.addOrder);
router.get("/get-orders", OrderControllers.getOrders);

export const orderRoutes = router;
