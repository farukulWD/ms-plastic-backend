import { Router } from "express";
import { AuthControllers } from "./authController.js";

const router = Router();

router.post("/login", AuthControllers.login);

export const authRoutes = router;
