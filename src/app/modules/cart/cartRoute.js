import { Router } from "express";
import { CartControllers } from "./cartController.js";

const router = Router();

router.post("/add-cart", CartControllers.addCart);

export const cartRoutes = router;
