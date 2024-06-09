import { User } from "./userModel.js";

const createUserIntoDB = async (user) => {
  const userData = user;

  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error("Email already exists");
  }
  const newUser = await User.create(userData);
  return newUser;
};

export const UserServices = {
  createUserIntoDB,
};
