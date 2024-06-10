import { AuthServices } from "./authService.js";

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await AuthServices.loginUser(email, password);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
    next(error);
  }
};

export const AuthControllers = {
  login,
};
