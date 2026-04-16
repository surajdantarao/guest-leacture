const express = require('express');
const router = express.Router();
const securityController = require('../controllers/securityController');
const { verifyToken, isSecurity } = require('../middleware/authMiddleware');

router.post('/checkin', verifyToken, isSecurity, securityController.checkIn);
router.post('/checkout', verifyToken, isSecurity, securityController.checkOut);
router.post('/verify-qr', verifyToken, isSecurity, securityController.verifyQrCode);

module.exports = router;
