import jwt from "jsonwebtoken";
import config from "../config/index.js";
import { User } from "../modules/user/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../errors/AppError.js";
import httpStatus from "http-status";

const auth = (...roles) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    const decode = jwt.verify(token, config.access_token);
    const { userId, userEmail } = decode;
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
    }

    if (user?.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
    }

    if (roles.length && !roles.includes(decode.role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized !");
    }
    next();
  });
};

export default auth;
