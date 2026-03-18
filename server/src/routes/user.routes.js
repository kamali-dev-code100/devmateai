const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, updateSettings, changePassword, deleteAccount } = require('../controllers/user.controller');
const { verifyJWT } = require('../middleware/auth.middleware');

router.use(verifyJWT);
router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.patch('/settings', updateSettings);
router.patch('/change-password', changePassword);
router.delete('/account', deleteAccount);

module.exports = router;
