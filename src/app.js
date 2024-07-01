import express from "express";
import cors from "cors";
import router from "./app/router/index.js";
import globalErrorHandler from "./app/middleware/globalErrorHandler.js";
import notFound from "./app/middleware/notFound.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/v1", router);
app.use(globalErrorHandler);
app.use(notFound);
export default app;
