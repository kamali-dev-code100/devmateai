const express = require('express');
const router = express.Router();
const { analyzeResume, chatWithResume, getResumes, getResume } = require('../controllers/resume.controller');
const { verifyJWT, checkCredits } = require('../middleware/auth.middleware');
const { aiLimiter } = require('../middleware/error.middleware');

router.use(verifyJWT);
router.post('/analyze', aiLimiter, checkCredits(5), analyzeResume);
router.post('/:id/chat', aiLimiter, checkCredits(1), chatWithResume);
router.get('/', getResumes);
router.get('/:id', getResume);

module.exports = router;
