import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse.js";
import { UserServices } from "./userService.js";
import catchAsync from "../../utils/catchAsync.js";

/*-------------------create user-------------------- */

const createUser = catchAsync(async (req, res) => {
  const userData = req?.body;
  const result = await UserServices.createUserIntoDB(userData);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "User created",
    success: true,
    data: result,
  });
});

/*-------------------get all user -------------------- */

const getUsers = catchAsync(async (req, res) => {
  const result = await UserServices.getUsersFromDb();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Users retrieved success",
    success: true,
    data: result,
  });
});

/*-------------------get single user-------------------- */

const getUser = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await UserServices.getSingleUserFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User retrieved success",
    success: true,
    data: result,
  });
});

/*-------------------update user role-------------------- */

const updateUserRole = catchAsync(async (req, res) => {
  const { id, email, role } = req?.body;
  const result = await UserServices.updateRole(id, email, role);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Update Role success",
    success: true,
    data: result,
  });
});

/*-------------------Delete user-------------------- */

const deleteUser = catchAsync(async (req, res) => {
  const { id } = req?.body;
  const result = await UserServices.deleteUserFromDb(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User Delete has been success",
    success: true,
    data: result,
  });
});

export const UserControllers = {
  createUser,
  getUsers,
  getUser,
  updateUserRole,
  deleteUser,
};
