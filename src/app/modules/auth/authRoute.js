import { Router } from "express";
import { AuthControllers } from "./authController.js";

const router = Router();

router.post("/login", AuthControllers.login);
router.post("/forget-password", AuthControllers.forgotPass);
router.post("/reset-password", AuthControllers.resetPassword);
router.post("/refresh-token", AuthControllers.getRefreshToken);
router.patch("/change-password/:id", AuthControllers.changePassword);

export const authRoutes = router;
