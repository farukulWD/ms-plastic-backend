import { ObjectId } from "mongodb";
import { User } from "./userModel.js";
import AppError from "../../errors/AppError.js";
import httpStatus from "http-status";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary.js";
import QueryBuilder from "../../builder/QueryBuilder.js";
import { userSearchableFields } from "./userConstance.js";

/*-------------------create user-------------------- */

const createUserIntoDB = async (file, user) => {
  const userData = user;
  if (file) {
    const imageName = `${userData?.name}${new Date().toLocaleString()}`;
    const path = file?.path;
    try {
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      userData.profilePicture = secure_url;
    } catch (error) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Image upload failed"
      );
    }
  }
  const newUser = await User.create(userData);
  return newUser;
};

/*-------------------get all users-------------------- */

const getUsersFromDb = async (query) => {
  const userQuery = new QueryBuilder(
    User.find().populate("addedProducts"),
    query
  )
    .search(userSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const pagination = await userQuery.countTotal();
  const users = await userQuery.modelQuery;

  return {
    users,
    pagination,
  };
};

/*-------------------get single user-------------------- */

const getSingleUserFromDB = async (id) => {
  if (!id) {
    throw new AppError(httpStatus.BAD_REQUEST, "Id is required");
  }
  if (id) {
    const user = await User.findOne({ _id: new ObjectId(id) })
      .populate("addedProducts")
      .select("-password");

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
