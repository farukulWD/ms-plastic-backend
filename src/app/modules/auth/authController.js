import { AuthServices } from "./authService.js";

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await AuthServices.loginUser(email, password);
    res.cookie("accessToken", result.token);

    res.status(200).json({
      success: true,
      data: { user: result?.user, accessToken: result.token },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
    next(error);
  }
};

export const AuthControllers = {
  login,
};
