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

// Smart callback URL resolver
const getCallbackUrl = (provider: 'google' | 'facebook') => {
  // Priority 1: Explicit environment variable
  if (provider === 'google' && process.env.GOOGLE_CALLBACK_URL) {
    return process.env.GOOGLE_CALLBACK_URL;
  }
  if (provider === 'facebook' && process.env.FACEBOOK_CALLBACK_URL) {
    return process.env.FACEBOOK_CALLBACK_URL;
  }
  
  // Priority 2: Use BASE_URL from environment
  const baseUrl = process.env.BASE_URL || 
    (process.env.NODE_ENV === 'production' 
      ? 'https://coffeemates-backend-service.onrender.com'
      : 'http://localhost:4343');
  
  return `${baseUrl}/api/auth/${provider}/callback`;
};

console.log('OAuth Configuration:');
console.log('- Google Callback:', getCallbackUrl('google'));
console.log('- Facebook Callback:', getCallbackUrl('facebook'));
console.log('- NODE_ENV:', process.env.NODE_ENV);

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: getCallbackUrl('google'),
    proxy: true // Important for production
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('Google OAuth - Profile received:', {
            id: profile.id,
            email: profile.emails?.[0]?.value,
            displayName: profile.displayName
        });
        
        let user = await User.findOne({ 
            $or: [
                { googleId: profile.id },
                { email: profile.emails?.[0]?.value }
            ]
        });
        
        if (user) {
            console.log('Google OAuth - Existing user found:', user.email);
            if (!user.googleId) {
                user.googleId = profile.id;
                user.oauthProvider = 'google';
                await user.save();
            }
        } else {
            console.log('Google OAuth - Creating new user');
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
        console.error('Google OAuth error:', error);
        return done(error as Error, undefined);
    }
}));

// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID!,
    clientSecret: process.env.FACEBOOK_APP_SECRET!,
    callbackURL: getCallbackUrl('facebook'),
    profileFields: ['id', 'emails', 'name', 'displayName'],
    scope: ['email'], 
    enableProof: true,
    proxy: true // Important for production
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('Facebook OAuth - Profile received:', {
            id: profile.id,
            email: profile.emails?.[0]?.value,
            displayName: profile.displayName
        });
        
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
            console.log('Facebook OAuth - Existing user found:', user.email);
            if (!user.facebookId) {
                user.facebookId = profile.id;
                user.oauthProvider = 'facebook';
                await user.save();
            }
        } else {
            console.log('Facebook OAuth - Creating new user');
            user = new User({
                facebookId: profile.id,
                email: profile.emails?.[0]?.value,
                username: profile.displayName?.replace(/\s+/g, '').toLowerCase() || `user${Date.now()}`,
                oauthProvider: 'facebook',
                password: await bcrypt.hash('oauth-user-' + Date.now(), 10)
            });
            await user.save();
        }
        
        return done(null, user);
    } catch (error) {
        console.error('Facebook OAuth error:', error);
        return done(error as Error, undefined);
    }
}));

export default passport;