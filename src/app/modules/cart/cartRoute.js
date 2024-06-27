import { Router } from "express";
import { CartControllers } from "./cartController.js";

const router = Router();

router.post("/add-cart", CartControllers.addCart);
router.get("/get-carts", CartControllers.getCarts);
router.get("/get-single-cart/:id", CartControllers.getCart);
router.delete("/delete-cart", CartControllers.deleteCart);
router.patch("/edit-cart/:id", CartControllers.editCart);

export const cartRoutes = router;
