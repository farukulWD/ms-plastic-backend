import config from "../../config/index.js";
import { createToken } from "../../utils/authToken.js";
import { User } from "../user/userModel.js";

const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new Error("Email and Password is required");
  }

  const user = await User.isUserExistsByEmail(email);

  if (!(await User.isPasswordMatch(password, user?.password))) {
    throw new Error("Password did't match");
  }

  if (user.isDeleted) {
    throw new Error("The user was deleted");
  }

  const jwtPayload = {
    userId: user._id,
    userEmail: user?.email,
    role: user?.role,
  };

  const token = createToken(jwtPayload, config.access_token);

  user.password = "";
  return { user, token };
};

export const AuthServices = {
  loginUser,
};
