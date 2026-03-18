const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  avatar: { type: String, default: '' },
  role: {
    type: String,
    enum: ['frontend', 'backend', 'fullstack', 'devops', 'mobile', 'other'],
    default: 'fullstack',
  },
  bio: { type: String, default: '' },
  skills: [{ type: String }],
  plan: { type: String, enum: ['free', 'pro', 'team'], default: 'free' },
  credits: { type: Number, default: 100 },
  creditsResetAt: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },
  refreshToken: { type: String },

  settings: {
    theme: { type: String, enum: ['dark', 'light', 'system'], default: 'system' },
    accentColor: { type: String, default: '#6ee7b7' },
    density: { type: String, enum: ['compact', 'comfortable', 'spacious'], default: 'comfortable' },
    preferredLanguage: { type: String, default: 'javascript' },
    aiResponseLength: { type: String, enum: ['short', 'medium', 'detailed'], default: 'medium' },
    aiPersonality: { type: String, enum: ['mentor', 'interviewer', 'reviewer'], default: 'mentor' },
    defaultInterviewRole: { type: String, default: 'Senior Software Engineer' },
    notifications: {
      emailAnalysis: { type: Boolean, default: true },
      emailInterview: { type: Boolean, default: true },
      weeklyReport: { type: Boolean, default: false },
      productUpdates: { type: Boolean, default: true },
      inAppSuggestions: { type: Boolean, default: true },
      creditWarnings: { type: Boolean, default: true },
    },
    twoFactorEnabled: { type: Boolean, default: false },
  },

  integrations: {
    github: { connected: Boolean, username: String, accessToken: String },
    linkedin: { connected: Boolean, profileUrl: String },
  },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive fields from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
