import { ObjectId } from "mongodb";
import { User } from "./userModel.js";

/*-------------------create user-------------------- */

const createUserIntoDB = async (user) => {
  const userData = user;

  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error("Email already exists");
  }
  const newUser = await User.create(userData);
  return newUser;
};

/*-------------------get all users-------------------- */

const getUsersFromDb = async () => {
  const users = await User.find({});
  return users;
};

/*-------------------update user role-------------------- */

const updateRole = async (id, email, role) => {
  if (!email && !id) {
    throw new Error("Email or Id is required");
  }
  const user = await User.findOne({ email: email, _id: new ObjectId(id) });
  const filter = { email: user?.email, _id: new ObjectId(user?._id) };
  const update = { role: role };
  if (user) {
    const result = await User.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true,
    });
    return result;
  } else {
    throw new Error("User Not found");
  }
};

/*-------------------Delete user-------------------- */

const deleteUserFromDb = async (id) => {
  if (!id) {
    throw new Error("Id is required");
  }
  const user = await User.findOne({ _id: new ObjectId(id) });
  const filter = { _id: new ObjectId(user?._id) };
  const update = { isDeleted: true };
  if (user) {
    const result = await User.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true,
    });
    return result;
  } else {
    throw new Error("User Not found");
  }
};

export const UserServices = {
  createUserIntoDB,
  updateRole,
  deleteUserFromDb,
  getUsersFromDb,
};
