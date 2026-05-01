import jwt from 'jsonwebtoken';
import userModel from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const generateRefreshToken = async (userId) => {
  const token = jwt.sign(
    { id: userId }, 
    process.env.REFRESH_SECRET_KEY, 
    { expiresIn: '7d' }
  );

  await userModel.updateOne(
    { _id: userId },
    { refresh_token: token }
  );

  return token;
};

export default generateRefreshToken;