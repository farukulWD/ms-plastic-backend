import { Router } from "express";
import { AuthControllers } from "./authController.js";

const router = Router();

router.post("/login", AuthControllers.login);
router.patch("/change-password/:id", AuthControllers.changePassword);
router.post("/forget-password", AuthControllers.forgotPass);

export const authRoutes = router;
