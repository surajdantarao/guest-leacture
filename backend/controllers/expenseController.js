const db = require('../models');
const LectureExpense = db.LectureExpense;
const Joi = require('joi');

const addExpense = async (req, res) => {
  const schema = Joi.object({
    lecture_id: Joi.number().allow(null),
    description: Joi.string().trim().min(2).required(),
    amount: Joi.number().positive().required()
  });

  const { error, value } = schema.validate(req.body || {});
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const expense = await LectureExpense.create(value);
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getExpenses = async (req, res) => {
  try {
    const expenses = await LectureExpense.findAll();
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getExpensesByLecture = async (req, res) => {
  try {
    const expenses = await LectureExpense.findAll({
      where: { lecture_id: req.params.lectureId }
    });
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expense = await LectureExpense.findByPk(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    await expense.destroy();
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  getExpensesByLecture,
  deleteExpense
};
