import catchAsync from "../utils/catchAsync.js";

const validateRequest = (schema) => {
  return catchAsync(async (req, res, next) => {
    await schema.parse({
      body: req.body,
      cookies: req.cookies,
    });

    next();
  });
};

export default validateRequest;
