import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { ENV } from '../config/environment';
import { User } from '../models/User';

export const generateAccessToken = (userId: string, email: string, role: string) => {
  return jwt.sign(
    { userId, email, role }, 
    ENV.JWT.ACCESS_SECRET, 
    { expiresIn: ENV.JWT.ACCESS_EXPIRATION }
  );
};

export const generateRefreshToken = async (userId: string, email: string, role: string) => {
  const refreshToken = uuidv4();
  
  // Store refresh token for validation
  await User.findByIdAndUpdate(userId, {
    $set: {
      refreshToken,
      refreshTokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  });

  return refreshToken;
};

export const verifyRefreshToken = async (refreshToken: string) => {
  const user = await User.findOne({
    refreshToken,
    refreshTokenExpiry: { $gt: new Date() }
  });

  if (!user) {
    throw new Error('Invalid refresh token');
  }

  return {
    userId: user._id.toString(),
    email: user.email,
    role: user.role
  };
};