import express from 'express';
import passport from '../utils/passport';
import { generateToken } from '../utils/auth';

const authRouter = express.Router();

// Google OAuth routes
authRouter.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

authRouter.get('/google/callback', 
    passport.authenticate('google', { 
        failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`,
        session: false 
    }),
    (req, res) => {
        // Generate JWT token for the authenticated user
        const user = req.user as any;
        const token = generateToken({
            userId: user._id.toString(),
            email: user.email
        });

        // Redirect to frontend with token
        res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}&userId=${user._id}`);
    }
);

// Facebook OAuth routes
authRouter.get('/facebook', passport.authenticate('facebook', {
    scope: ['email']
}));

authRouter.get('/facebook/callback',
    passport.authenticate('facebook', { 
        failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`,
        session: false 
    }),
    (req, res) => {
        // Generate JWT token for the authenticated user
        const user = req.user as any;
        const token = generateToken({
            userId: user._id.toString(),
            email: user.email
        });

        // Redirect to frontend with token
        res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}&userId=${user._id}`);
    }
);

export default authRouter;