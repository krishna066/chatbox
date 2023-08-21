import jwt from "jsonwebtoken";
import db from "../models/index.js";

export const createJWT = async (tokenData, tokenExpireTime) => {
  try {
    const secretKey = process.env.SECRET_KEY;
    const token = await jwt.sign(tokenData, secretKey, {
      expiresIn: tokenExpireTime,
    });
    return token;
  } catch (err) {
    console.error("Error creating token:", err);
  }
};

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;
  const secretKey = process.env.SECRET_KEY;
  const invalidTokensResult = await db.invalidTokens.findAll();
  const blockedTokens = invalidTokensResult.map((item) => item.blockedToken);
  if (!token) {
    return res.status(403).json({ message: "Token not provided" });
  }
  if (blockedTokens.includes(token)) {
    return res.status(401).json({ message: "Token is expired" });
  }

  jwt.verify(token, secretKey, (err, decodedData) => {
    if (err) {
      return res.status(401).json({ message: "Token is invalid" });
    }
    req.user = decodedData;
    next();
  });
};
