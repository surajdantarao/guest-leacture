const express = require('express');
const router = express.Router();
const checklistController = require('../controllers/checklistController');
const { verifyToken, isAdmin, isStaff } = require('../middleware/authMiddleware');

router.post('/', verifyToken, isAdmin, checklistController.createChecklistItem);
router.get('/:lectureId', verifyToken, checklistController.getChecklistByLecture);
router.put('/:id/status', verifyToken, isStaff, checklistController.updateItemStatus);

module.exports = router;
