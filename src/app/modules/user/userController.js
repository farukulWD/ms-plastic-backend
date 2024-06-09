import { UserServices } from "./userService.js";

export const createUser = async (req, res, next) => {
  try {
    const userData = req?.body;

    const result = await UserServices.createUserIntoDB(userData);
    res.status(200).json({ Success: true, data: result });
  } catch (error) {
    if (error.message === "Email already exists") {
      res.status(400).json({ Success: false, message: error.message });
    } else {
      res
        .status(500)
        .json({ Success: false, message: "Internal Server Error" });
    }
    next(error);
  }
};

export const UserControllers = {
  createUser,
};
