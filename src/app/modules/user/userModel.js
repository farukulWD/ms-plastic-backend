import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import config from "../../config/index.js";
import { ObjectId } from "mongodb";

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
  return bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model("User", userSchema);
