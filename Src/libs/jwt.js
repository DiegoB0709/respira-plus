import dotenv from "dotenv";
dotenv.config();
const TOKEN_SECRET = process.env.JWT_SECRET;

import jwt from "jsonwebtoken";

export function CreateAccessToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      TOKEN_SECRET,
      {
        expiresIn: "1d",
      },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
}

