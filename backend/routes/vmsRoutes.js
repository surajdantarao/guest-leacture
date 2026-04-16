const express = require('express');
const router = express.Router();
const vmsController = require('../controllers/vmsController');
const { verifyToken, optionalVerifyToken, isAdmin, isSecurity } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/register-visitor', optionalVerifyToken, upload.single('idProofFile'), vmsController.registerVisitor);
router.post('/admin/approve', verifyToken, isAdmin, vmsController.adminApprove);
router.post('/admin/reject', verifyToken, isAdmin, vmsController.adminReject);
router.get('/pass/:id', optionalVerifyToken, vmsController.getPassById);
router.get('/pass/:id/qr-image', optionalVerifyToken, vmsController.getPassQrImage);
router.post('/scan-entry', verifyToken, isSecurity, vmsController.scanEntry);
router.post('/scan-exit', verifyToken, isSecurity, vmsController.scanExit);

module.exports = router;
