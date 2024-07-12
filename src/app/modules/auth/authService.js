import path from "path";
import { fileURLToPath } from "url";
import httpStatus from "http-status";
import config from "../../config/index.js";
import AppError from "../../errors/AppError.js";
import { createToken, verifyToken } from "../../utils/authToken.js";
import { User } from "../user/userModel.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { sendEmail } from "../../utils/sendEmail.js";
import getTemplate from "../../utils/getTemplate.js";
import { UAParser } from "ua-parser-js";
import jwt from "jsonwebtoken";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    name: user?.name,
    role: user?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in
  );

  user.password = "";
  user.accessToken = accessToken;
  return { accessToken, refreshToken };
};

const refreshToken = async (token) => {
  let decoded;

  try {
    decoded = jwt.verify(token, config.jwt_refresh_expires_in);
  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
  }

  const { userId, userEmail, iat } = decoded;
  const user = await User.findOne({ email: userEmail });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
  }

  const jwtPayload = {
    userId: user._id,
    userEmail: user?.email,
    name: user?.name,
    role: user?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in
  );

  return accessToken;
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

const forgetPassword = async (req, email) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is not found!");
  }
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
  }

  const jwtPayload = {
    userId: user._id,
    userEmail: user?.email,
    name: user?.name,
    role: user?.role,
  };

  const resetToken = createToken(jwtPayload, config.jwt_access_secret, "10m");

  const templatePath = path.join(
    __dirname,
    "../../email-template/resetPassword.html"
  );

  const parser = new UAParser(req.headers["user-agent"]);
  const osName = parser.getOS().name || "Unknown OS";
  const browserName = parser.getBrowser().name || "Unknown Browser";

  const replacements = {
    name: user.name,
    action_url: `${config.frontendUrl}/auth/reset-password?token=${resetToken}`,
    operating_system: osName,
    browser_name: browserName,
    support_url: `${config.frontendUrl}/support`,
  };
  const template = await getTemplate(templatePath, replacements);

  sendEmail(user.email, template);
};

const resetPassword = async (token, data) => {
  const { email, password } = data;

  if (!token) {
    throw new AppError(httpStatus.BAD_REQUEST, "Token is require");
  }

  if (!email) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email is require");
  }
  if (!password) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password is require");
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is not found!");
  }
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, config.jwt_access_secret);
  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
  }

  if (email !== decoded.userEmail) {
    throw new AppError(httpStatus.FORBIDDEN, "You are forbidden!");
  }

  const newHashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds)
  );

  const result = await User.findOneAndUpdate(
    { _id: new ObjectId(decoded?.userId) },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    }
  );
  result.password = "";
  return result;
};

export const AuthServices = {
  loginUser,
  changePassword,
  forgetPassword,
  resetPassword,
  refreshToken,
};
