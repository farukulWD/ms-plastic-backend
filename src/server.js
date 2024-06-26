import mongoose from "mongoose";
import app from "./app.js";
import config from "./app/config/index.js";

const main = async () => {
  try {
    await mongoose.connect(config.database_url);
    console.log("MongoDB Connected...");
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

main();
