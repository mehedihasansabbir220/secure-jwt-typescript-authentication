import express from 'express';
import { registerController, loginController, refreshTokenController } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateRegistration, validateLogin, validateRefreshToken } from '../middleware/validationMiddleware';

const router = express.Router();

router.post('/register', validateRegistration, registerController);
router.post('/login', validateLogin, loginController);
router.post('/refresh-token', validateRefreshToken, refreshTokenController);
router.get('/profile', authMiddleware, (req, res) => {
  res.json({ message: 'Protected route accessed', user: req.user });
});

export default router;
