const express = require('express');
const router = express.Router();
const { register, login, getMe, forgotPassword, resetPassword, verifyOTP, resendOTP } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resettoken', resetPassword);

module.exports = router;
