const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User.model');

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// ─── GitHub Strategy ──────────────────────────────────────────
passport.use(new GitHubStrategy({
  clientID:     process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL:  'http://localhost:5000/api/auth/github/callback',
  scope: ['user:email'],
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    let user = await User.findOne({ email: profile.emails?.[0]?.value });

    if (user) {
      // Update github integration
      user.integrations = user.integrations || {};
      user.integrations.github = {
        connected: true,
        username: profile.username,
        accessToken,
      };
      await user.save({ validateBeforeSave: false });
      return done(null, user);
    }

    // Create new user
    user = await User.create({
      name:     profile.displayName || profile.username,
      email:    profile.emails?.[0]?.value || `${profile.username}@github.com`,
      password: `github_oauth_${profile.id}_${Date.now()}`,
      avatar:   profile.photos?.[0]?.value || '',
      isVerified: true,
      integrations: {
        github: {
          connected: true,
          username: profile.username,
          accessToken,
        },
      },
    });

    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

// ─── Google Strategy ──────────────────────────────────────────
passport.use(new GoogleStrategy({
  clientID:     process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:  'http://localhost:5000/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails?.[0]?.value });

    if (user) {
      return done(null, user);
    }

    user = await User.create({
      name:     profile.displayName,
      email:    profile.emails?.[0]?.value,
      password: `google_oauth_${profile.id}_${Date.now()}`,
      avatar:   profile.photos?.[0]?.value || '',
      isVerified: true,
    });

    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

module.exports = passport;