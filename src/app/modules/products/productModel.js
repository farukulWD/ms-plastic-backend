import { Schema } from "mongoose";

export const productSchema = new Schema({
  code: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  groupName: {
    type: String,
    require: true,
  },
});
