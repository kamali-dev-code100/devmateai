const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const { asyncHandler, ApiError, ApiResponse } = require('../utils/helpers');

// GET /api/user/profile
const getProfile = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, req.user));
});

// PATCH /api/user/profile
const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ['name', 'bio', 'role', 'skills', 'avatar'];
  const updates = {};
  allowed.forEach(field => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true, runValidators: true,
  });
  res.json(new ApiResponse(200, user, 'Profile updated'));
});

// PATCH /api/user/settings
const updateSettings = asyncHandler(async (req, res) => {
  const { settings } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { settings } },
    { new: true }
  );
  res.json(new ApiResponse(200, user.settings, 'Settings updated'));
});

// PATCH /api/user/change-password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new ApiError(400, 'Current password is incorrect');

  if (newPassword.length < 8) throw new ApiError(400, 'Password must be at least 8 characters');

  user.password = newPassword;
  await user.save();

  res.json(new ApiResponse(200, null, 'Password changed successfully'));
});

// DELETE /api/user/account
const deleteAccount = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const user = await User.findById(req.user._id);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(400, 'Password is incorrect');

  await User.findByIdAndDelete(req.user._id);

  res
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .json(new ApiResponse(200, null, 'Account deleted'));
});

module.exports = { getProfile, updateProfile, updateSettings, changePassword, deleteAccount };
