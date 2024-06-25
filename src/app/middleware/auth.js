import jwt from "jsonwebtoken";
import config from "../config/index.js";
import { User } from "../modules/user/userModel.js";

const auth = (...roles) => {
  return async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new Error("Authorization require");
    }

    try {
      const decode = jwt.verify(token, config.access_token);
      const { userId, userEmail } = decode;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(403).json({
          success: false,
          message: "user not found",
        });
      }

      if (user?.isDeleted) {
        return res.status(403).json({
          success: false,
          message: "This user is deleted",
        });
      }

      if (roles.length && !roles.includes(decode.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You do not have the right permissions",
        });
      }
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  };
};

export default auth;
