import httpStatus from "http-status";
import config from "../../config/index.js";
import AppError from "../../errors/AppError.js";
import { createToken } from "../../utils/authToken.js";
import { User } from "../user/userModel.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { sendEmail } from "../../utils/sendEmail.js";

const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Email and Password is required"
    );
  }

  const user = await User.isUserExistsByEmail(email);

  if (!(await User.isPasswordMatch(password, user?.password))) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password did't match");
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "The user was deleted");
  }

  const jwtPayload = {
    userId: user._id,
    userEmail: user?.email,
    role: user?.role,
  };

  const token = createToken(jwtPayload, config.access_token, "1d");

  user.password = "";
  return { user, token };
};

const changePassword = async (id, passwordData) => {
  const user = await User.findOne({ _id: new ObjectId(id) }).select(
    "+password"
  );
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is not found!");
  }
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
  }

  if (!(await User.isPasswordMatch(passwordData.oldPassword, user?.password))) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your current password did't match"
    );
  }

  const newHashedPassword = await bcrypt.hash(
    passwordData.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  const result = await User.findOneAndUpdate(
    { _id: new ObjectId(user?._id) },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    }
  );
  return result;
};

const forgetPassword = async (id) => {
  const user = await User.findOne({ _id: new ObjectId(id) });
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is not found!");
  }
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const resetToken = createToken(jwtPayload, config.access_token, "10m");
  const resetUILink = `${config.reset_pass_ui_link}?id=${user.id}&token=${resetToken} `;
  sendEmail(user.email, resetUILink);
};

export const AuthServices = {
  loginUser,
  changePassword,
  forgetPassword,
};
