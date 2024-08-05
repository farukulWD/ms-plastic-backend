import { v2 as cloudinary } from "cloudinary";
import config from "../config/index.js";

import fs from "fs";
import multer from "multer";
import path from "path";

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

export const sendImageToCloudinary = (imageName, path) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      path,
      { public_id: imageName.trim() },
      function (error, result) {
        if (error) {
          // console.error("Cloudinary upload error:", error);
          reject(error);
        }
        resolve(result);
        fs.unlink(path, (err) => {
          if (err) {
            console.log("Error deleting file:", err);
          } else {
            console.log("File deleted.");
          }
        });
      }
    );
  });
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + "/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});
export const upload = multer({ storage: storage });
