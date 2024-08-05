const handleZodError = (err) => {
  const errorSources = err?.issues?.map((issue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue.message,
    };
  });

  const statusCode = 400;

  return {
    statusCode,
    message:
      (errorSources &&
        errorSources["0"]?.path.toUpperCase() +
          " " +
          errorSources["0"]?.message) ||
      "Validation Error",
    errorSources,
  };
};

export default handleZodError;
