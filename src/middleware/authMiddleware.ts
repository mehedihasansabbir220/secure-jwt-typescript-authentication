import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/environment';
import { User } from '../models/User';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        res.status(401).json({ error: 'Authentication required' });
        return; // Avoid returning a Promise<Response>
      }
  
      const decoded = jwt.verify(token, ENV.JWT.ACCESS_SECRET) as TokenPayload;
  
      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) {
        res.status(401).json({ error: 'Invalid user' });
        return;
      }
  
      req.user = decoded;
      next(); // Pass control to the next middleware/handler
    } catch (error) {
      next(error); // Ensure errors are passed via next()
    }
  };   

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};