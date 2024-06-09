import express from "express";
import { UserControllers } from "./userController.js";

const router = express.Router();

router.post("/create-user", UserControllers.createUser);

export const userRoutes = router;
