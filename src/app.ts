import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import { ENV } from './config/environment';
import logger from './config/logger';
import authRoutes from './routes/authRoutes';

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Database Connection
mongoose.connect(ENV.MONGODB_URI)
  .then(() => logger.info('MongoDB connected successfully'))
  .catch((error) => logger.error('MongoDB connection error:', error));

// Start Server
const PORT = ENV.PORT;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;