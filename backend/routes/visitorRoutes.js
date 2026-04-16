const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController');
const { verifyToken, optionalVerifyToken, isAdmin, isSecurity } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/request', optionalVerifyToken, upload.single('idProofFile'), visitorController.requestVisit);
router.put('/:id', verifyToken, isAdmin, upload.single('idProofFile'), visitorController.updateVisitor);
router.get('/my-requests', verifyToken, visitorController.getUserVisitors);
router.get('/stats', verifyToken, isAdmin, visitorController.getDashboardStats);
router.get('/', verifyToken, isSecurity, visitorController.getAllVisitors);
router.put('/:id/approve', verifyToken, isAdmin, visitorController.approveVisit);
router.put('/:id/reject', verifyToken, isAdmin, visitorController.rejectVisit);

module.exports = router;
