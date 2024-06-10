import { Schema, model } from "mongoose";

export const userSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    profilePicture: {
      type: String,
      require: true,
    },
    mobile: {
      type: Number,
      require: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "master", "manger"],
      default: "user",
    },
    isDeleted: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const User = model("User", userSchema);
