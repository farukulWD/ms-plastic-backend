import { UserServices } from "./userService.js";

/*-------------------create user-------------------- */

const createUser = async (req, res, next) => {
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

/*-------------------get all user -------------------- */

const getUsers = async (req, res, next) => {
  try {
    const result = await UserServices.getUsersFromDb();
    res.status(200).json({ Success: true, data: result });
  } catch (error) {
    res.status(500).json({ Success: false, message: "Internal Server Error" });
    next(error);
  }
};

/*-------------------update user role-------------------- */

const updateUserRole = async (req, res, next) => {
  try {
    const { id, email, role } = req?.body;
    const result = await UserServices.updateRole(id, email, role);
    res.status(200).json({ Success: true, data: result });
  } catch (error) {
    if (error.message === "Email is required") {
      res.status(400).json({ Success: false, message: error.message });
    } else if (error.message === "User Not found") {
      res.status(400).json({ Success: false, message: error.message });
    } else {
      res
        .status(500)
        .json({ Success: false, message: "Internal Server Error" });
    }

    next(error);
  }
};

/*-------------------Delete user-------------------- */

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req?.body;
    const result = await UserServices.deleteUserFromDb(id);
    res.status(200).json({ Success: true, data: result });
  } catch (error) {
    if (error.message === "Id is required") {
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
  getUsers,
  updateUserRole,
  deleteUser,
};
