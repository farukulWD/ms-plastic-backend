import express from "express";
import { UserControllers } from "./userController.js";
import auth from "../../middleware/auth.js";
import { user_role } from "./userModel.js";

const router = express.Router();

router.post("/create-user", UserControllers.createUser);
router.get(
  "/users",
  auth(user_role.admin, user_role.master),
  UserControllers.getUsers
);
router.get("/user/:id", UserControllers.getUser);
router.patch(
  "/update-user-role",
  auth(user_role.admin, user_role.master),
  UserControllers.getUsers,
  UserControllers.updateUserRole
);
router.delete(
  "/delete-user",
  auth(user_role.admin, user_role.master),
  UserControllers.getUsers,
  UserControllers.deleteUser
);

export const userRoutes = router;
