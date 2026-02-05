import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const generateAccessToken = (userId) => {
  if (!userId) throw new Error("User ID is required to generate access token");

  return jwt.sign(
    { id: userId },
    process.env.ACCESS_SECRET_KEY,
    { expiresIn: "5h" }
  );
};

export default generateAccessToken;
