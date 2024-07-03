import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync.js";
import { AuthServices } from "./authService.js";
import sendResponse from "../../utils/sendResponse.js";
import config from "../../config/index.js";

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await AuthServices.loginUser(email, password);
  // Set the cookie on the backend
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 1000,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login success",
    data: { accessToken: result?.accessToken },
  });
});

const getRefreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token is retrieved successfully!",
    data: { accessToken: result },
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
  const { email } = req.body;
  const result = await AuthServices.forgetPassword(req, email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reset link is generated successfully!",
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  const result = await AuthServices.resetPassword(token, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password has been reset success",
    data: result,
  });
});

export const AuthControllers = {
  login,
  changePassword,
  forgotPass,
  resetPassword,
  getRefreshToken,
};
