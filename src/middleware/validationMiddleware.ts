import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { 
  registerValidationSchema, 
  loginValidationSchema, 
  refreshTokenValidationSchema 
} from '../utils/validationSchemas';

// Middleware for validating registration
export const validateRegistration = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = registerValidationSchema.validate(req.body);

  if (error) {
    res.status(400).json({
      error: 'Validation Failed',
      details: error.details.map((detail) => detail.message),
    });
    return; // Ensure we stop execution here
  }

  next();
};

// Middleware for validating login
export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = loginValidationSchema.validate(req.body);

  if (error) {
    res.status(400).json({
      error: 'Validation Failed',
      details: error.details.map((detail) => detail.message),
    });
    return;
  }

  next();
};

// Middleware for validating refresh token
export const validateRefreshToken = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = refreshTokenValidationSchema.validate(req.body);

  if (error) {
    res.status(400).json({
      error: 'Validation Failed',
      details: error.details.map((detail) => detail.message),
    });
    return;
  }

  next();
};
