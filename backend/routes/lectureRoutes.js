const express = require('express');
const router = express.Router();
const lectureController = require('../controllers/lectureController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.post('/', verifyToken, isAdmin, lectureController.createLecture);
router.get('/', lectureController.getAllLectures);
router.put('/:id', verifyToken, isAdmin, lectureController.updateLecture);
router.delete('/:id', verifyToken, isAdmin, lectureController.deleteLecture);

module.exports = router;
