const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { asyncHandler, ApiError } = require('../utils/helpers');

// ─── Verify JWT ───────────────────────────────────────────────
const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header('Authorization')?.replace('Bearer ', '');

  if (!token) throw new ApiError(401, 'Access denied. No token provided.');

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded._id).select('-password -refreshToken');

  if (!user) throw new ApiError(401, 'Invalid token. User not found.');

  req.user = user;
  next();
});

// ─── Check Credits ────────────────────────────────────────────
const checkCredits = (required = 1) =>
  asyncHandler(async (req, res, next) => {
    if (req.user.credits < required) {
      throw new ApiError(402, `Insufficient credits. Required: ${required}, Available: ${req.user.credits}`);
    }
    next();
  });

// ─── Deduct Credits ───────────────────────────────────────────
const deductCredits = (amount = 1) =>
  asyncHandler(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, { $inc: { credits: -amount } });
    next();
  });

module.exports = { verifyJWT, checkCredits, deductCredits };
