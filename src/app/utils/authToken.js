import jwt from "jsonwebtoken";
export const createToken = (jwtPayload, secret) => {
  return jwt.sign(jwtPayload, secret);
};

export const verifyToken = (token, secret) => {
  return jwt.verify();
};
