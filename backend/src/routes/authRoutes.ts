import express from 'express';
import passport from '../config/passport';
import { generateToken } from '../middleware/auth';
import { IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = express.Router();

// Google OAuth login
router.get('/google', (req, res, next) => {
  // Check if Google OAuth is configured
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
    return res.redirect(`${frontendURL}/auth/error?message=oauth_not_configured`);
  }

  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

// Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    try {
      const user = req.user as IUser;
      const token = generateToken(user.id);
      
      // Redirect to frontend with token - determine URL from referer
      const referer = req.get('Referer');
      let frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';

      if (referer) {
        const refererUrl = new URL(referer);
        frontendURL = `${refererUrl.protocol}//${refererUrl.host}`;
      }

      res.redirect(`${frontendURL}/auth/callback?token=${token}`);
    } catch (error) {
      console.error('Error in Google callback:', error);
      const referer = req.get('Referer');
      let frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';

      if (referer) {
        const refererUrl = new URL(referer);
        frontendURL = `${refererUrl.protocol}//${refererUrl.host}`;
      }

      res.redirect(`${frontendURL}/auth/error`);
    }
  }
);

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  // Since we're using JWT, logout is handled on the client side
  // by removing the token from storage
  res.json({ message: 'Logged out successfully' });
});

export default router;
