const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', feedbackController.submitFeedback);
router.get('/:lectureId', feedbackController.getFeedbackByLecture);

module.exports = router;
