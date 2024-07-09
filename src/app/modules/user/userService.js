import { ObjectId } from "mongodb";
import { User } from "./userModel.js";
import AppError from "../../errors/AppError.js";
import httpStatus from "http-status";
import buildFilter from "../../utils/buildFilter.js";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary.js";

/*-------------------create user-------------------- */

const createUserIntoDB = async (file, user) => {
  const userData = user;
  if (file) {
    const imageName = `${userData.id}${userData?.name?.firstName}`;
    const path = file?.path;
    console.log(imageName, path);

    try {
      // Send image to Cloudinary
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      userData.profileImg = secure_url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
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
  const { page, limit, sort, isDelete, mobile, ...rest } = query;
  const filter = buildFilter(rest);
  const sortOption = {
    createdAt: sort === "newest" ? -1 : 1,
  };

  if (isDelete === "true" || isDelete === "false") {
    filter.isDelete = isDelete;
  }

  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 30;
  const skip = (pageNumber - 1) * limitNumber;

  const users = await User.find(filter)
    .populate("addedProducts")
    .sort(sortOption)
    .limit(limitNumber)
    .skip(skip);

  const totalUsers = await User.countDocuments(filter);
  const totalPages = Math.ceil(totalUsers / limitNumber);

  return {
    users,
    pagination: {
      total: totalUsers,
      totalPages,
      currentPage: pageNumber,
    },
  };
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
