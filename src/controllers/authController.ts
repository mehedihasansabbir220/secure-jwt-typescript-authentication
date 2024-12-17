import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { ENV } from '../config/environment';
import * as TokenService from '../services/tokenService';
import logger from '../config/logger';

export const registerController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(ENV.BCRYPT_SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Generate tokens
    const accessToken = TokenService.generateAccessToken(newUser._id.toString(), newUser.email, newUser.role);
    const refreshToken = await TokenService.generateRefreshToken(newUser._id.toString(), newUser.email, newUser.role);

    logger.info(`User registered: ${newUser.email}`);

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: newUser._id, username: newUser.username, email: newUser.email },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error); // Forward error to error-handling middleware
  }
};

export const loginController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate tokens
    const accessToken = TokenService.generateAccessToken(user._id.toString(), user.email, user.role);
    const refreshToken = await TokenService.generateRefreshToken(user._id.toString(), user.email, user.role);

    logger.info(`User logged in: ${user.email}`);

    res.json({
      accessToken,
      refreshToken,
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshTokenController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    // Verify refresh token
    const userData = await TokenService.verifyRefreshToken(refreshToken);

    // Generate new access token
    const newAccessToken = TokenService.generateAccessToken(userData.userId, userData.email, userData.role);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};
