const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.post('/', verifyToken, isAdmin, expenseController.addExpense);
router.get('/', verifyToken, isAdmin, expenseController.getExpenses);
router.get('/:lectureId', verifyToken, isAdmin, expenseController.getExpensesByLecture);
router.delete('/:id', verifyToken, isAdmin, expenseController.deleteExpense);

module.exports = router;
