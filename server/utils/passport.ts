import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../models/User';
import bcrypt from 'bcrypt';


// Serialize user for sessions
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: `${process.env.BASE_URL}/api/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ 
            $or: [
                { googleId: profile.id },
                { email: profile.emails?.[0]?.value }
            ]
        });
        
        if (user) {
            // Update existing user with Google ID if not already set
            if (!user.googleId) {
                user.googleId = profile.id;
                user.oauthProvider = 'google';
                await user.save();
            }
        } else {
            // Create new user
            user = new User({
                googleId: profile.id,
                email: profile.emails?.[0]?.value,
                username: profile.displayName?.replace(/\s+/g, '').toLowerCase() || `user${Date.now()}`,
                oauthProvider: 'google',
                password: await bcrypt.hash('oauth-user-' + Date.now(), 10)
            });
            await user.save();
        }
        
        return done(null, user);
    } catch (error) {
        return done(error as Error, undefined);
    }
}));

// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID!,
    clientSecret: process.env.FACEBOOK_APP_SECRET!,
    callbackURL: `${process.env.BASE_URL}/api/auth/facebook/callback`,
    profileFields: ['id', 'emails', 'name', 'displayName'],
    scope: ['email'], 
    enableProof: true 
}, async (accessToken, refreshToken, profile, done) => {
    try {
        if (!profile.emails || !profile.emails[0] || !profile.emails[0].value) {
            return done(new Error('Facebook did not provide an email address'), undefined);
        }
        let user = await User.findOne({ 
            $or: [
                { facebookId: profile.id },
                { email: profile.emails?.[0]?.value }
            ]
        });
        
        if (user) {
            // Update existing user with Facebook ID if not already set
            if (!user.facebookId) {
                user.facebookId = profile.id;
                user.oauthProvider = 'facebook';
                await user.save();
            }
        } else {
            // Create new user
            user = new User({
                facebookId: profile.id,
                email: profile.emails?.[0]?.value,
                username: profile.displayName?.replace(/\s+/g, '').toLowerCase() || `user${Date.now()}`,
                oauthProvider: 'facebook'
            });
            await user.save();
        }
        
        return done(null, user);
    } catch (error) {
        return done(error as Error, undefined);
    }
}));

export default passport;