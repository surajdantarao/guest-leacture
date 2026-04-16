const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, feedbackController.submitFeedback);
router.get('/:lectureId', verifyToken, feedbackController.getFeedbackByLecture);

module.exports = router;
