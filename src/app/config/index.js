import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join((process.cwd(), ".env")) });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BYCRIPT_HASH_ROUNDS,
  access_token: process.env.JWT_ACCESS_SECRET,
  frontendUrl: process.env.FRONTEND_URL,
};
