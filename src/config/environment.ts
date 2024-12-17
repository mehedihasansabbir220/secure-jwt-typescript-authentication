import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || '',
  JWT: {
    ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || '',
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '',
    ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION || '15m',
    REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || '7d'
  },
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10')
};