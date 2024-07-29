import express from "express";
import { UserControllers } from "./userController.js";
import auth from "../../middleware/auth.js";
import { user_role } from "./userModel.js";
import { upload } from "../../utils/sendImageToCloudinary.js";
import validateRequest from "../../middleware/validateRequest.js";
import { userValidation } from "./userValidation.js";

const router = express.Router();

router.post(
  "/create-user",
  upload.single("file"),
  (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(userValidation.createUserValidation),
  UserControllers.createUser
);
router.get(
  "/users",
  auth(user_role.admin, user_role.master),
  UserControllers.getUsers
);
router.get("/user/:id", UserControllers.getUser);
router.patch(
  "/update-user-role",
  auth(user_role.admin, user_role.master),
  validateRequest(userValidation.createUserValidation),
  UserControllers.updateUserRole
);
router.delete(
  "/delete-user",
  auth(user_role.admin, user_role.master),
  UserControllers.deleteUser
);

export const userRoutes = router;
