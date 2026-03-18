const express = require('express');
const router = express.Router();
const { register, login, logout, refreshToken, getMe } = require('../controllers/auth.controller');
const { verifyJWT } = require('../middleware/auth.middleware');
const { authLimiter } = require('../middleware/error.middleware');

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', verifyJWT, logout);
router.post('/refresh', refreshToken);
router.get('/me', verifyJWT, getMe);

module.exports = router;
