const { Interview, CodeReview, LearningPath, BugSession } = require('../models');
const User = require('../models/User.model');
const openaiService = require('../services/ai/openai.service');
const {
  interviewSystemPrompt,
  codeReviewPrompt,
  codeReviewChatPrompt,
  learningPathPrompt,
  bugFixPrompt,
  bugFixChatPrompt,
} = require('../services/ai/prompts');
const { asyncHandler, ApiError, ApiResponse } = require('../utils/helpers');

// ═══════════════════════════════════════════════════════════════
// INTERVIEW CONTROLLER
// ═══════════════════════════════════════════════════════════════

const startInterview = asyncHandler(async (req, res) => {
  const { role, type = 'mixed', difficulty = 'senior' } = req.body;

  const systemPrompt = interviewSystemPrompt(role, type, difficulty);
  const opening = await openaiService.chat(systemPrompt, [
    { role: 'user', content: 'Please start the interview with your first question.' },
  ]);

  const session = await Interview.create({
    user: req.user._id,
    role, type, difficulty,
    messages: [{ role: 'assistant', content: opening }],
    creditsUsed: 1,
  });
  await User.findByIdAndUpdate(req.user._id, { $inc: { credits: -1 } });

  res.status(201).json(new ApiResponse(201, session, 'Interview started'));
});

const sendInterviewMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const session = await Interview.findOne({ _id: req.params.id, user: req.user._id });
  if (!session) throw new ApiError(404, 'Interview session not found');
  if (session.status === 'completed') throw new ApiError(400, 'Session already completed');

  const systemPrompt = interviewSystemPrompt(session.role, session.type, session.difficulty);
  const history = session.messages.slice(-12).map(m => ({
    role: m.role, content: m.content,
  }));

  const reply = await openaiService.chat(systemPrompt, [
    ...history,
    { role: 'user', content: message },
  ]);

  session.messages.push({ role: 'user', content: message });
  session.messages.push({ role: 'assistant', content: reply });
  session.creditsUsed += 1;
  await session.save();
  await User.findByIdAndUpdate(req.user._id, { $inc: { credits: -1 } });

  res.json(new ApiResponse(200, { reply, sessionId: session._id }));
});

const endInterview = asyncHandler(async (req, res) => {
  const session = await Interview.findOne({ _id: req.params.id, user: req.user._id });
  if (!session) throw new ApiError(404, 'Session not found');

  const systemPrompt = interviewSystemPrompt(session.role, session.type, session.difficulty);
  const summary = await openaiService.chat(systemPrompt, [
    ...session.messages.slice(-20).map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: 'The interview is complete. Please provide an overall score (0-100) and summary.' },
  ], { jsonMode: false });

  const scoreMatch = summary.match(/(\d{1,3})\/100|score[:\s]+(\d{1,3})/i);
  const overallScore = scoreMatch ? parseInt(scoreMatch[1] || scoreMatch[2]) : 70;

  session.status = 'completed';
  session.overallScore = overallScore;
  session.summary = summary;
  await session.save();

  res.json(new ApiResponse(200, session, 'Interview completed'));
});

const getInterviews = asyncHandler(async (req, res) => {
  const sessions = await Interview.find({ user: req.user._id })
    .select('-messages')
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(new ApiResponse(200, sessions));
});

const getInterview = asyncHandler(async (req, res) => {
  const session = await Interview.findOne({ _id: req.params.id, user: req.user._id });
  if (!session) throw new ApiError(404, 'Session not found');
  res.json(new ApiResponse(200, session));
});

// ═══════════════════════════════════════════════════════════════
// CODE REVIEW CONTROLLER
// ═══════════════════════════════════════════════════════════════

const reviewCode = asyncHandler(async (req, res) => {
  const { code, language = 'javascript' } = req.body;
  if (!code || code.length < 10) throw new ApiError(400, 'Please provide code to review');

  const CREDITS_COST = 3;
  await User.findByIdAndUpdate(req.user._id, { $inc: { credits: -CREDITS_COST } });

  const systemPrompt = codeReviewPrompt(language);
  const raw = await openaiService.chat(systemPrompt, [
    { role: 'user', content: `Review this ${language} code:\n\`\`\`${language}\n${code}\n\`\`\`` },
  ], { jsonMode: true });

  const review = openaiService.parseJSON(raw);
  if (!review) throw new ApiError(500, 'AI response parsing failed');

  const codeReview = await CodeReview.create({
    user: req.user._id,
    language, code, review,
    creditsUsed: CREDITS_COST,
    messages: [{ role: 'assistant', content: `Review complete! Score: ${review.overallScore}/100` }],
  });

  res.status(201).json(new ApiResponse(201, codeReview, 'Code reviewed successfully'));
});

const chatWithCodeReview = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const review = await CodeReview.findOne({ _id: req.params.id, user: req.user._id });
  if (!review) throw new ApiError(404, 'Code review not found');

  await User.findByIdAndUpdate(req.user._id, { $inc: { credits: -1 } });
  const systemPrompt = codeReviewChatPrompt(review.language, review.code, review.review);
  const history = review.messages.slice(-8).map(m => ({ role: m.role, content: m.content }));

  const reply = await openaiService.chat(systemPrompt, [
    ...history, { role: 'user', content: message },
  ]);
  review.messages.push({ role: 'user', content: message });
  review.messages.push({ role: 'assistant', content: reply });
  await review.save();

  res.json(new ApiResponse(200, { reply }));
});

const getCodeReviews = asyncHandler(async (req, res) => {
  const reviews = await CodeReview.find({ user: req.user._id })
    .select('-code -review.fixedCode -messages')
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(new ApiResponse(200, reviews));
});

// ═══════════════════════════════════════════════════════════════
// LEARNING PATH CONTROLLER
// ═══════════════════════════════════════════════════════════════

const generateLearningPath = asyncHandler(async (req, res) => {
  const { goal, currentSkills = [], timeline = '3 months' } = req.body;

  const CREDITS_COST = 5;
  await User.findByIdAndUpdate(req.user._id, { $inc: { credits: -CREDITS_COST } });

  const systemPrompt = learningPathPrompt(goal, currentSkills, timeline);
  const raw = await openaiService.chat(systemPrompt, [
    { role: 'user', content: `Generate a personalized learning path for: ${goal}` },
  ], { jsonMode: true, maxTokens: 3000 });

  const pathData = openaiService.parseJSON(raw);
  if (!pathData) throw new ApiError(500, 'AI response parsing failed');

  const learningPath = await LearningPath.create({
    user: req.user._id,
    goal,
    currentSkills,
    ...pathData,
    creditsUsed: CREDITS_COST,
  });

  res.status(201).json(new ApiResponse(201, learningPath, 'Learning path generated'));
});

const getLearningPaths = asyncHandler(async (req, res) => {
  const paths = await LearningPath.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(new ApiResponse(200, paths));
});

const updateModuleProgress = asyncHandler(async (req, res) => {
  const { completed } = req.body;
  const path = await LearningPath.findOne({ _id: req.params.id, user: req.user._id });
  if (!path) throw new ApiError(404, 'Learning path not found');

  const module = path.modules.id(req.params.moduleId);
  if (!module) throw new ApiError(404, 'Module not found');

  module.completed = completed;
  module.completedAt = completed ? new Date() : undefined;

  const completedCount = path.modules.filter(m => m.completed).length;
  path.progress = Math.round((completedCount / path.modules.length) * 100);
  await path.save();

  res.json(new ApiResponse(200, path, 'Progress updated'));
});

// ═══════════════════════════════════════════════════════════════
// BUG FIX CONTROLLER
// ═══════════════════════════════════════════════════════════════

const diagnoseBug = asyncHandler(async (req, res) => {
  const { bugDescription, code, errorMessage, language = 'javascript' } = req.body;

  const CREDITS_COST = 2;
  await User.findByIdAndUpdate(req.user._id, { $inc: { credits: -CREDITS_COST } });

  const systemPrompt = bugFixPrompt(language);
  const userMessage = [
    bugDescription && `Bug description: ${bugDescription}`,
    errorMessage && `Error message: ${errorMessage}`,
    code && `Code:\n\`\`\`${language}\n${code}\n\`\`\``,
  ].filter(Boolean).join('\n\n');

  const reply = await openaiService.chat(systemPrompt, [
    { role: 'user', content: userMessage },
  ], { maxTokens: 3000 });

  const session = await BugSession.create({
    user: req.user._id,
    title: bugDescription?.slice(0, 60) || 'Bug fix session',
    bugDescription,
    errorMessage,
    language,
    originalCode: code,
    messages: [
      { role: 'user', content: userMessage },
      { role: 'assistant', content: reply },
    ],
    creditsUsed: CREDITS_COST,
  });

  res.status(201).json(new ApiResponse(201, { reply, sessionId: session._id }));
});

const continueBugSession = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const session = await BugSession.findOne({ _id: req.params.id, user: req.user._id });
  if (!session) throw new ApiError(404, 'Bug session not found');

  await User.findByIdAndUpdate(req.user._id, { $inc: { credits: -1 } });
  const systemPrompt = bugFixChatPrompt(session.language, session.originalCode);
  const history = session.messages.slice(-8).map(m => ({ role: m.role, content: m.content }));

  const reply = await openaiService.chat(systemPrompt, [
    ...history, { role: 'user', content: message },
  ]);
  session.messages.push({ role: 'user', content: message });
  session.messages.push({ role: 'assistant', content: reply });
  await session.save();

  res.json(new ApiResponse(200, { reply }));
});

const getBugSessions = asyncHandler(async (req, res) => {
  const sessions = await BugSession.find({ user: req.user._id })
    .select('-messages -originalCode')
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(new ApiResponse(200, sessions));
});

module.exports = {
  startInterview, sendInterviewMessage, endInterview, getInterviews, getInterview,
  reviewCode, chatWithCodeReview, getCodeReviews,
  generateLearningPath, getLearningPaths, updateModuleProgress,
  diagnoseBug, continueBugSession, getBugSessions,
};
