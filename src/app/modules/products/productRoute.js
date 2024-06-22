import { Router } from "express";
import { ProductControllers } from "./productController.js";

const router = Router();

router.post("/add-product", ProductControllers.addProduct);
router.get("/get-products", ProductControllers.getProducts);
router.patch("/edit-product/:id", ProductControllers.editProduct);
router.delete("/delete-product", ProductControllers.deleteProduct);

export const productRoutes = router;
