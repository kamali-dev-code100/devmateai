const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const oauthRoutes = require('./oauth.routes'); 
const userRoutes = require('./user.routes');
const resumeRoutes = require('./resume.routes');
const { interviewRouter, codeReviewRouter, learningPathRouter, bugFixRouter } = require('./tools.routes');

router.use('/auth', authRoutes);
router.use('/auth', oauthRoutes);
router.use('/user', userRoutes);
router.use('/resume', resumeRoutes);
router.use('/interview', interviewRouter);
router.use('/code-review', codeReviewRouter);
router.use('/learning-path', learningPathRouter);
router.use('/bug-fix', bugFixRouter);

module.exports = router;
