import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const TOKEN_SECRET = process.env.JWT_SECRET;

export const authRequired = (req, res, next) => {
  const { token } = req.cookies;

  if (!token)
    return res
      .status(401)
      .json({ message: "No se detecto token, acceso denegado" });

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) return res.status(401).json({ message: "Token invalido" });

    req.user = user;
    next();
  });
};
