import { Router } from "express";
import { CartControllers } from "./cartController.js";

const router = Router();

router.post("/add-cart", CartControllers.addCart);
router.get("/get-carts", CartControllers.getCarts);
router.delete("/delete-cart", CartControllers.deleteCart);

export const cartRoutes = router;
