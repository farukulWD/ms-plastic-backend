import { Router } from "express";
import { userRoutes } from "../modules/user/userRoute.js";
import { authRoutes } from "../modules/auth/authRoute.js";
import { productRoutes } from "../modules/products/productRoute.js";

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/product",
    route: productRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
