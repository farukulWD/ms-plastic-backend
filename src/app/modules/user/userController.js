import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse.js";
import { UserServices } from "./userService.js";

/*-------------------create user-------------------- */

const createUser = async (req, res, next) => {
  try {
    const userData = req?.body;
    const result = await UserServices.createUserIntoDB(userData);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: "User created",
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
    next(error);
  }
};

/*-------------------get all user -------------------- */

const getUsers = async (req, res, next) => {
  try {
    const result = await UserServices.getUsersFromDb();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Users retrieved success",
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
    next(error);
  }
};

/*-------------------get single user-------------------- */

const getUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await UserServices.getSingleUserFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "User retrieved success",
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
    next(error);
  }
};

/*-------------------update user role-------------------- */

const updateUserRole = async (req, res, next) => {
  try {
    const { id, email, role } = req?.body;
    const result = await UserServices.updateRole(id, email, role);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Update Role success",
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ Success: false, message: error.message });

    next(error);
  }
};

/*-------------------Delete user-------------------- */

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req?.body;
    const result = await UserServices.deleteUserFromDb(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "User Delete has been success",
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
    next(error);
  }
};

export const UserControllers = {
  createUser,
  getUsers,
  getUser,
  updateUserRole,
  deleteUser,
};
