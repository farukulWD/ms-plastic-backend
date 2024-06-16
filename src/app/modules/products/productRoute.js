import { Router } from "express";
import { ProductControllers } from "./productController.js";

const router = Router();

router.post("/add-product", ProductControllers.addProduct);

export const productRoutes = router;
