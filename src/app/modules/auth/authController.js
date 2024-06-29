import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync.js";
import { AuthServices } from "./authService.js";
import sendResponse from "../../utils/sendResponse.js";

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await AuthServices.loginUser(email, password);
  res.cookie("accessToken", result.token);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login success",
    data: { user: result?.user, accessToken: result.token },
  });
});

const changePassword = catchAsync(async (req, res) => {
  const id = req.params;
  const passwordData = req.body;
  const result = await AuthServices.changePassword(id, passwordData);
  result.password = "";
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password has been success",
    data: result,
  });
});

const forgotPass = catchAsync(async (req, res) => {
  const id = req.body;
  const result = await AuthServices.forgetPassword(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reset link is generated successfully!",
    data: result,
  });
});

export const AuthControllers = {
  login,
  changePassword,
  forgotPass,
};
