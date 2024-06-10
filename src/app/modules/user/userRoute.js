import express from "express";
import { UserControllers } from "./userController.js";

const router = express.Router();

router.post("/create-user", UserControllers.createUser);
router.get("/users", UserControllers.getUsers);
router.patch("/update-user-role", UserControllers.updateUserRole);
router.delete("/delete-user", UserControllers.deleteUser);

export const userRoutes = router;
