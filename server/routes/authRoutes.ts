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
            callbackUrl: `${process.env.BASE_URL}/api/auth/google/callback`
        },
        baseUrl: process.env.BASE_URL
    });
});

export default authRouter;