import express from "express";
import cors from "cors";
import router from "./app/router/index.js";
import globalErrorHandler from "./app/middleware/globalErrorHandler.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1", router);
app.use(globalErrorHandler);
export default app;
