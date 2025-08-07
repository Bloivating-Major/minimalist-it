import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

// Ensure environment variables are loaded
dotenv.config();

// Only initialize if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL ||
          (process.env.NODE_ENV === 'production'
            ? 'https://minimalist-it.onrender.com/api/auth/google/callback'
            : 'http://localhost:5000/api/auth/google/callback')
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user exists
          let existingUser = await User.findOne({ googleId: profile.id });
          
          if (existingUser) {
            // Update user info in case it changed
            existingUser.name = profile.displayName || existingUser.name;
            existingUser.picture = profile.photos?.[0]?.value || existingUser.picture;
            await existingUser.save();
            return done(null, existingUser);
          }

          // Create new user
          const newUser = new User({
            googleId: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName,
            picture: profile.photos?.[0]?.value
          });

          const savedUser = await newUser.save();
          return done(null, savedUser);
        } catch (error) {
          console.error('Error in Google OAuth strategy:', error);
          return done(error, false);
        }
      }
    )
  );
} else {
  console.warn('❌ Google OAuth credentials not provided. Authentication will not work.');
  console.warn('Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file');
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});

export default passport;
