const mongoose = require('mongoose');
const { Schema } = mongoose;

// ─── Message Schema (reused) ──────────────────────────────────
const messageSchema = new Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// ─── Resume Analysis ──────────────────────────────────────────
const resumeSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: String,
  rawText: String,
  targetRole: String,
  analysis: {
    atsScore: Number,
    keywordCoverage: Number,
    overallRating: String,
    sections: {
      summary: { score: Number, feedback: String },
      skills: { score: Number, feedback: String },
      experience: { score: Number, feedback: String },
      education: { score: Number, feedback: String },
    },
    strengths: [String],
    suggestions: [String],
    missingKeywords: [String],
  },
  messages: [messageSchema],
  creditsUsed: { type: Number, default: 5 },
}, { timestamps: true });

// ─── Interview Session ────────────────────────────────────────
const interviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, required: true },
  type: { type: String, enum: ['technical', 'behavioral', 'system-design', 'mixed'], default: 'mixed' },
  difficulty: { type: String, enum: ['junior', 'mid', 'senior', 'staff'], default: 'senior' },
  messages: [{
    role: { type: String, enum: ['assistant', 'user'] },
    content: String,
    score: Number,
    feedback: String,
    createdAt: { type: Date, default: Date.now },
  }],
  overallScore: Number,
  summary: String,
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  creditsUsed: { type: Number, default: 0 },
}, { timestamps: true });

// ─── Code Review ──────────────────────────────────────────────
const codeReviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  language: { type: String, default: 'javascript' },
  code: { type: String, required: true },
  review: {
    overallScore: Number,
    summary: String,
    issues: [{
      severity: { type: String, enum: ['critical', 'warning', 'info', 'good'] },
      line: Number,
      message: String,
      suggestion: String,
      category: { type: String, enum: ['security', 'performance', 'style', 'logic', 'maintainability'] },
    }],
    fixedCode: String,
    positives: [String],
  },
  messages: [messageSchema],
  creditsUsed: { type: Number, default: 3 },
}, { timestamps: true });

// ─── Learning Path ────────────────────────────────────────────
const learningPathSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  goal: String,
  currentSkills: [String],
  targetRole: String,
  estimatedWeeks: Number,
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  modules: [{
    order: Number,
    title: String,
    description: String,
    topics: [String],
    resources: [{
      title: String,
      url: String,
      type: { type: String, enum: ['article', 'video', 'course', 'book', 'practice'] },
      platform: String,
    }],
    estimatedHours: Number,
    completed: { type: Boolean, default: false },
    completedAt: Date,
  }],
  progress: { type: Number, default: 0 },
  creditsUsed: { type: Number, default: 5 },
}, { timestamps: true });

// ─── Bug Fix Session ──────────────────────────────────────────
const bugSessionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  bugDescription: String,
  errorMessage: String,
  language: String,
  originalCode: String,
  diagnosis: {
    rootCause: String,
    explanation: String,
    fixedCode: String,
    preventionTips: [String],
  },
  messages: [messageSchema],
  resolved: { type: Boolean, default: false },
  creditsUsed: { type: Number, default: 2 },
}, { timestamps: true });

module.exports = {
  Resume: mongoose.model('Resume', resumeSchema),
  Interview: mongoose.model('Interview', interviewSchema),
  CodeReview: mongoose.model('CodeReview', codeReviewSchema),
  LearningPath: mongoose.model('LearningPath', learningPathSchema),
  BugSession: mongoose.model('BugSession', bugSessionSchema),
};
