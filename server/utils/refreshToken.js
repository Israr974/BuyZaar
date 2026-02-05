import jwt from 'jsonwebtoken';
import userModel from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const generateRefreshToken = async (userId) => {
  try {
    
    const token = jwt.sign({ id: userId }, process.env.REFRESH_SECRET_KEY, { expiresIn: '7d' });

    
    const result = await userModel.updateOne(
      { _id: userId },
      { refresh_token: token }
    );

    if (result.modifiedCount === 0) {
      console.warn('Refresh token not updated in DB for user:', userId);
    }

    return token;
  } catch (error) {
    console.error('Error generating refresh token:', error);
    throw error;
  }
};

export default generateRefreshToken;
