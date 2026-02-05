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
    passport.authenticate('google', { 
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

// authRoutes.ts - Add this comprehensive debug route
authRouter.get('/debug-production', async (req, res) => {
    try {
        const User = require('../models/User').default;
        const mongoose = require('mongoose');
        
        const debugInfo = {
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            isProduction: process.env.NODE_ENV === 'production',
            
            // Google OAuth config
            googleConfig: {
                clientId: process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing',
                clientSecret: process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Missing',
                callbackUrl: process.env.GOOGLE_CALLBACK_URL,
                actualCallbackUrl: `${req.protocol}://${req.get('host')}/api/auth/google/callback`
            },
            
            // URLs
            urls: {
                clientUrl: process.env.CLIENT_URL,
                baseUrl: process.env.BASE_URL,
                currentUrl: `${req.protocol}://${req.get('host')}`,
                requestUrl: req.originalUrl
            },
            
            // Database
            database: {
                connected: mongoose.connection.readyState === 1,
                readyState: mongoose.connection.readyState,
                hasModel: !!User,
                modelName: User?.modelName
            },
            
            // Passport
            passport: {
                strategies: passport.strategies ? Object.keys(passport.strategies) : []
            }
        };
        
        console.log('🔍 Production Debug Info:', debugInfo);
        res.json(debugInfo);
        
    } catch (error) {
        console.error('Debug route error:', error);
        res.status(500).json({ error: (error as Error).message });
    }
});

export default authRouter;