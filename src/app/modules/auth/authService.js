import { User } from "../user/userModel.js";

const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new Error("Email and Password is required");
  }

  const user = await User.findOne({ email: email });

  if (!user.password === password) {
    throw new Error("Password did't match");
  }

  if (user.isDeleted) {
    throw new Error("The user was deleted");
  }

  return user;
};

export const AuthServices = {
  loginUser,
};
