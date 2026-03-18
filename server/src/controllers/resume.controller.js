const { Resume } = require('../models');
const User = require('../models/User.model');
const openaiService = require('../services/ai/openai.service');
const { resumeAnalyzePrompt, resumeChatPrompt } = require('../services/ai/prompts');
const { asyncHandler, ApiError, ApiResponse } = require('../utils/helpers');

// POST /api/resume/analyze
const analyzeResume = asyncHandler(async (req, res) => {
  const { resumeText, targetRole, fileName } = req.body;

  if (!resumeText || resumeText.length < 100) {
    throw new ApiError(400, 'Please provide resume text (min 100 characters)');
  }

  const CREDITS_COST = 5;
  await User.findByIdAndUpdate(req.user._id, { $inc: { credits: -CREDITS_COST } });

  const systemPrompt = resumeAnalyzePrompt(targetRole || 'Software Engineer');
  const raw = await openaiService.chat(systemPrompt, [
    { role: 'user', content: `Resume text:\n\n${resumeText}` },
  ], { jsonMode: true });

  const analysis = openaiService.parseJSON(raw);
  if (!analysis) throw new ApiError(500, 'AI response parsing failed');

  const resume = await Resume.create({
    user: req.user._id,
    fileName: fileName || 'resume.pdf',
    rawText: resumeText,
    targetRole,
    analysis,
    creditsUsed: CREDITS_COST,
    messages: [
      { role: 'assistant', content: `Analysis complete! ATS Score: ${analysis.atsScore}/100` },
    ],
  });

  res.status(201).json(new ApiResponse(201, resume, 'Resume analyzed successfully'));
});

// POST /api/resume/:id/chat
const chatWithResume = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) throw new ApiError(404, 'Resume not found');

  await User.findByIdAndUpdate(req.user._id, { $inc: { credits: -1 } });

  const systemPrompt = resumeChatPrompt(resume.targetRole, resume.analysis);
  const history = resume.messages.slice(-10).map(m => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: m.content,
  }));

  const reply = await openaiService.chat(systemPrompt, [
    ...history,
    { role: 'user', content: message },
  ]);

  resume.messages.push({ role: 'user', content: message });
  resume.messages.push({ role: 'assistant', content: reply });
  await resume.save();

  res.json(new ApiResponse(200, { reply, resumeId: resume._id }));
});

// GET /api/resume
const getResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ user: req.user._id })
    .select('-rawText -messages')
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(new ApiResponse(200, resumes));
});

// GET /api/resume/:id
const getResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) throw new ApiError(404, 'Resume not found');
  res.json(new ApiResponse(200, resume));
});

module.exports = { analyzeResume, chatWithResume, getResumes, getResume };
