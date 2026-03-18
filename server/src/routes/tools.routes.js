// ── interview.routes.js ──────────────────────────────────────
const express = require('express');
const interviewRouter = express.Router();
const {
  startInterview, sendInterviewMessage, endInterview, getInterviews, getInterview,
} = require('../controllers/tools.controller');
const { verifyJWT, checkCredits } = require('../middleware/auth.middleware');
const { aiLimiter } = require('../middleware/error.middleware');

interviewRouter.use(verifyJWT);
interviewRouter.post('/start', aiLimiter, checkCredits(1), startInterview);
interviewRouter.post('/:id/message', aiLimiter, checkCredits(1), sendInterviewMessage);
interviewRouter.post('/:id/end', endInterview);
interviewRouter.get('/', getInterviews);
interviewRouter.get('/:id', getInterview);

// ── codeReview.routes.js ──────────────────────────────────────
const codeReviewRouter = express.Router();
const { reviewCode, chatWithCodeReview, getCodeReviews } = require('../controllers/tools.controller');

codeReviewRouter.use(verifyJWT);
codeReviewRouter.post('/', aiLimiter, checkCredits(3), reviewCode);
codeReviewRouter.post('/:id/chat', aiLimiter, checkCredits(1), chatWithCodeReview);
codeReviewRouter.get('/', getCodeReviews);

// ── learningPath.routes.js ────────────────────────────────────
const learningPathRouter = express.Router();
const { generateLearningPath, getLearningPaths, updateModuleProgress } = require('../controllers/tools.controller');

learningPathRouter.use(verifyJWT);
learningPathRouter.post('/generate', aiLimiter, checkCredits(5), generateLearningPath);
learningPathRouter.get('/', getLearningPaths);
learningPathRouter.patch('/:id/module/:moduleId', updateModuleProgress);

// ── bugFix.routes.js ──────────────────────────────────────────
const bugFixRouter = express.Router();
const { diagnoseBug, continueBugSession, getBugSessions } = require('../controllers/tools.controller');

bugFixRouter.use(verifyJWT);
bugFixRouter.post('/', aiLimiter, checkCredits(2), diagnoseBug);
bugFixRouter.post('/:id/message', aiLimiter, checkCredits(1), continueBugSession);
bugFixRouter.get('/', getBugSessions);

module.exports = { interviewRouter, codeReviewRouter, learningPathRouter, bugFixRouter };
