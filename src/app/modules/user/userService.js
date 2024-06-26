import { ObjectId } from "mongodb";
import { User } from "./userModel.js";
import AppError from "../../errors/AppError.js";
import httpStatus from "http-status";

/*-------------------create user-------------------- */

const createUserIntoDB = async (user) => {
  const userData = user;
  const newUser = await User.create(userData);
  return newUser;
};

/*-------------------get all users-------------------- */

const getUsersFromDb = async () => {
  const users = await User.find({}).populate("addedProducts");
  return users;
};

/*-------------------get single user-------------------- */

const getSingleUserFromDB = async (id) => {
  if (!id) {
    throw new AppError(httpStatus.BAD_REQUEST, "Id is required");
  }
  if (id) {
    const user = User.findOne({ _id: new ObjectId(id) }).populate(
      "addedProducts"
    );
    return user;
  }
};

/*-------------------update user role-------------------- */

const updateRole = async (id, email, role) => {
  if (!email && !id) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email or Id is required");
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
    throw new AppError(httpStatus.BAD_REQUEST, "User Not found");
  }
};

/*-------------------Delete user-------------------- */

const deleteUserFromDb = async (id) => {
  if (!id) {
    throw new AppError(httpStatus.BAD_REQUEST, "Id is required");
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
    throw new AppError(httpStatus.BAD_REQUEST, "User Not found");
  }
};

export const UserServices = {
  createUserIntoDB,
  updateRole,
  deleteUserFromDb,
  getUsersFromDb,
  getSingleUserFromDB,
};
