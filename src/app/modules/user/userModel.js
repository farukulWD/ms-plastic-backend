import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import config from "../../config/index.js";

export const user_role = {
  admin: "admin",
  master: "master",
  manager: "manager",
  user: "user",
};

export const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
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
    passwordChangedAt: {
      type: Date,
    },
    addedProducts: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

userSchema.post("save", function (doc, next) {
  (doc.password = ""), next();
});

userSchema.statics.isUserExistsByEmail = async function (email) {
  return await User.findOne({ email: email }).select("+password");
};

userSchema.statics.isPasswordMatch = async function (
  plainTextPassword,
  hashedPassword
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model("User", userSchema);
