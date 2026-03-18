const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const User = require('../models/User.model');

// ── Local Strategy (email + password) ────────────────────────
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email }).select('+password');
      if (!user) return done(null, false, { message: 'No account with that email' });
      const match = await user.comparePassword(password);
      if (!match) return done(null, false, { message: 'Incorrect password' });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// ── GitHub OAuth (only load if credentials exist) ────────────
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  const { Strategy: GitHubStrategy } = require('passport-github2');
  passport.use(new GitHubStrategy({
    clientID:     process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL:  `${process.env.SERVER_URL || 'http://localhost:5000'}/api/auth/github/callback`,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ githubId: profile.id });
      if (!user) {
        user = await User.findOne({ email: profile.emails?.[0]?.value });
        if (user) {
          user.githubId = profile.id;
          await user.save();
        } else {
          user = await User.create({
            name:     profile.displayName || profile.username,
            email:    profile.emails?.[0]?.value || `${profile.id}@github.com`,
            githubId: profile.id,
            avatar:   profile.photos?.[0]?.value,
            password: Math.random().toString(36),
          });
        }
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));
  console.log('✅ GitHub OAuth enabled');
} else {
  console.log('⚠️  GitHub OAuth skipped — GITHUB_CLIENT_ID not set');
}

// ── Google OAuth (only load if credentials exist) ────────────
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
  passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  `${process.env.SERVER_URL || 'http://localhost:5000'}/api/auth/google/callback`,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = await User.findOne({ email: profile.emails?.[0]?.value });
        if (user) {
          user.googleId = profile.id;
          await user.save();
        } else {
          user = await User.create({
            name:     profile.displayName,
            email:    profile.emails?.[0]?.value,
            googleId: profile.id,
            avatar:   profile.photos?.[0]?.value,
            password: Math.random().toString(36),
          });
        }
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));
  console.log('✅ Google OAuth enabled');
} else {
  console.log('⚠️  Google OAuth skipped — GOOGLE_CLIENT_ID not set');
}

// ── Serialize / Deserialize ───────────────────────────────────
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;