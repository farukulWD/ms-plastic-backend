import { Router } from "express";
import { ProductControllers } from "./productController.js";

const router = Router();

router.post("/add-product", ProductControllers.addProduct);
router.patch("/edit-product/:id", ProductControllers.editProduct);

export const productRoutes = router;
