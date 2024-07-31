import { ZodError } from "zod";
import config from "../config/index.js";
import AppError from "../errors/AppError.js";
import HandleCastError from "../errors/HandleCastError.js";
import handleDuplicateError from "../errors/handleDuplicateError.js";
import handleValidationError from "../errors/handleValidationError.js";
import handleZodError from "../errors/HandleZodError.js";

const globalErrorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorSources = [
    {
      path: "",
      message: "Something went wrong",
    },
  ];
  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err?.name === "ValidationError") {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err?.name === "CastError") {
    const simplifiedError = HandleCastError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err?.message,
      },
    ];
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err,
    stack: config.NODE_ENV === "development" ? err?.stack : null,
  });
};

export default globalErrorHandler;
