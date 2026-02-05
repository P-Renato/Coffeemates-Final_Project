import express from 'express';
import passport from '../utils/passport';
import { generateToken } from '../utils/auth';
import { login, register } from '../controllers/authController';

const authRouter = express.Router();
authRouter.post('/login', login);
authRouter.post('/register', register);

// Google OAuth initiation route
authRouter.get('/google', (req, res, next) => {
    next();
}, passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false // This should prevent serialization
}));

// Facebook OAuth initiation route  
authRouter.get('/facebook', passport.authenticate('facebook', {
    scope: ['email'],
    session: false
}));

// Google OAuth callback - REPLACE your current version with this
authRouter.get('/google/callback', 
    (req, res, next) => {
    console.log('=== GOOGLE OAUTH CALLBACK ===');
    console.log('Query params:', req.query);
    console.log('Has code parameter:', !!req.query.code);
    
    if (!req.query.code) {
      console.log('❌ No code parameter provided');
      return res.redirect(`${process.env.CLIENT_URL}/login?error=no_oauth_code`);
    }
    next();
  },
    passport.authenticate('google', { 
        failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`,
        session: false,
        failureMessage: true
    }),
    async (req, res) => {
        try {
            console.log('✅ Google OAuth successful, processing user...');
      
            if (!req.user) {
                throw new Error('No user object from Passport');
            }

            const user = req.user as any;
            const token = generateToken({
                userId: user._id.toString(),
                email: user.email
            });

            // Include complete user data
            const userData = {
                id: user._id.toString(),
                username: user.username,
                email: user.email
            };

            const encodedUserData = encodeURIComponent(JSON.stringify(userData));
            
            console.log('OAuth redirect with user data:', userData);
            // Determine redirect URL
            const clientUrl = process.env.CLIENT_URL || 'https://coffeemates-client.onrender.com';
            const redirectUrl = `${clientUrl}/oauth-success?token=${token}&user=${encodedUserData}`;
            
            console.log('Redirecting to:', redirectUrl);
            res.redirect(redirectUrl);
            
        } catch (error) {
            console.error('❌ OAuth callback processing error:', error);
            console.error('Error stack:', (error as Error).stack);
            
            const clientUrl = process.env.CLIENT_URL || 'https://coffeemates-client.onrender.com';
            const errorMessage = encodeURIComponent((error as Error).message);
            res.redirect(`${clientUrl}/login?error=oauth_processing_failed&message=${errorMessage}`);
        }
    }
);

// Facebook OAuth callback - REPLACE your current version with this
authRouter.get('/facebook/callback',
    passport.authenticate('facebook', { 
        failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`,
        session: false 
    }),
    async (req, res) => {
        try {
            const user = req.user as any;
            const token = generateToken({
                userId: user._id.toString(),
                email: user.email
            });

            // Include complete user data
            const userData = {
                id: user._id.toString(),
                username: user.username,
                email: user.email
            };

            const encodedUserData = encodeURIComponent(JSON.stringify(userData));
            
            console.log('OAuth redirect with user data:', userData);
            
            // Redirect with both token AND user data
            res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}&user=${encodedUserData}`);
        } catch (error) {
            console.error('OAuth callback error:', error);
            res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
        }
    }
);

// Test OAuth configuration
authRouter.get('/config', (req, res) => {
    res.json({
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Missing',
            callbackUrl: `${process.env.VITE_API_URL}/api/auth/google/callback`
        },
        baseUrl: process.env.BASE_URL
    });
});

/// Add this route to authRoutes.ts
authRouter.get('/test-db', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const User = require('../models/User').default;
    
    const dbStatus = {
      connected: mongoose.connection.readyState === 1,
      readyState: mongoose.connection.readyState,
      states: {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
      },
      hasUserModel: !!User,
      userCount: await User.countDocuments()
    };
    
    res.json({
      status: '✅ Database test',
      ...dbStatus
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ 
      status: '❌ Database error',
      error: (error as Error).message,
      stack: process.env.NODE_ENV === 'production' ? undefined : (error as Error).stack
    });
  }
});

// Add to authRoutes.ts or create a new health route
authRouter.get('/health', (req, res) => {
  const mongoose = require('mongoose');
  
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: {
      connected: mongoose.connection.readyState === 1,
      state: mongoose.connection.readyState
    },
    services: {
      googleOAuth: !!process.env.GOOGLE_CLIENT_ID,
      clientUrl: process.env.CLIENT_URL
    }
  });
});

export default authRouter;