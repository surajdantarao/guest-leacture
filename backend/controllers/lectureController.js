const db = require('../models');
const Lecture = db.Lecture;
const User = db.User;
const whatsappService = require('../services/whatsappService');
const Joi = require('joi');

const expenseItemSchema = Joi.object({
  description: Joi.string().trim().min(2).required(),
  amount: Joi.number().positive().required()
});

const createLectureSchema = Joi.object({
  speaker_name: Joi.string().trim().min(2).required(),
  topic: Joi.string().trim().min(2).required(),
  department: Joi.string().trim().min(2).required(),
  venue: Joi.string().trim().min(2).required(),
  dateTime: Joi.date().iso(),
  lecture_date: Joi.date(),
  lecture_time: Joi.string(),
  description: Joi.string().allow('', null),
  image_url: Joi.string().uri().allow('', null),
  assignee_name: Joi.string().allow('', null),
  assignee_phone: Joi.string().allow('', null),
  admin_phone: Joi.string().allow('', null),
  status: Joi.string().valid('scheduled', 'completed', 'cancelled'),
  expenses: Joi.array().items(expenseItemSchema).optional()
}).or('dateTime', 'lecture_date');

const updateLectureSchema = Joi.object({
  speaker_name: Joi.string().trim().min(2),
  topic: Joi.string().trim().min(2),
  department: Joi.string().trim().min(2),
  venue: Joi.string().trim().min(2),
  dateTime: Joi.date().iso(),
  lecture_date: Joi.date(),
  lecture_time: Joi.string(),
  description: Joi.string().allow('', null),
  image_url: Joi.string().uri().allow('', null),
  assignee_name: Joi.string().allow('', null),
  assignee_phone: Joi.string().allow('', null),
  admin_phone: Joi.string().allow('', null),
  status: Joi.string().valid('scheduled', 'completed', 'cancelled'),
  expenses: Joi.array().items(expenseItemSchema).optional()
}).min(1);

const createLecture = async (req, res) => {
  const { error } = createLectureSchema.validate(req.body || {});
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const { 
      speaker_name, topic, department, venue, dateTime, description, 
      image_url, assignee_name, assignee_phone, admin_phone, status,
      expenses // Expecting an array of { description, amount }
    } = req.body;
    
    let lecture_date, lecture_time;
    if (dateTime) {
      const dt = new Date(dateTime);
      if (Number.isNaN(dt.getTime())) {
        return res.status(400).json({ message: 'Invalid dateTime provided.' });
      }
      lecture_date = dt.toISOString().split('T')[0];
      lecture_time = dt.toTimeString().split(' ')[0];
    } else {
      lecture_date = req.body.lecture_date;
      lecture_time = req.body.lecture_time;
    }

    const lecture = await Lecture.create({
      speaker_name,
      topic,
      department,
      venue,
      lecture_date,
      lecture_time,
      description,
      image_url,
      assignee_name,
      assignee_phone,
      admin_phone,
      status: status || 'scheduled'
    });

    if (expenses && Array.isArray(expenses)) {
      const expenseData = expenses.map(exp => ({
        ...exp,
        lecture_id: lecture.id
      }));
      await db.LectureExpense.bulkCreate(expenseData);
    }
    
    res.status(201).json(lecture);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllLectures = async (req, res) => {
  try {
    const includeDeleted = req.query.includeDeleted === 'true';
    const lectures = await Lecture.findAll({
      paranoid: !includeDeleted,
      order: [['created_at', 'DESC'], ['id', 'DESC']],
      include: [
        { 
          model: db.Feedback,
          as: 'Feedbacks',
          include: [{ model: User, attributes: ['name'] }]
        },
        {
          model: db.LectureExpense,
          as: 'LectureExpenses'
        },
        {
          model: db.LectureChecklist,
          as: 'LectureChecklists'
        }
      ]
    });

    const formattedLectures = lectures.map(l => {
      const lectureJson = l.toJSON();
      // Use associations from the instance or the JSON object
      const feedbacks = l.Feedbacks || lectureJson.Feedbacks || [];
      const expenses = l.LectureExpenses || lectureJson.LectureExpenses || [];
      const checklists = l.LectureChecklists || lectureJson.LectureChecklists || [];
      
      return {
        ...lectureJson,
        votes: feedbacks.filter(f => f.rating === 5).length,
        totalExpenses: expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0),
        expenses: expenses,
        checklists: checklists,
        feedbacks: feedbacks.map(f => ({
          text: f.comment,
          date: f.created_at || f.createdAt,
          userName: f.guest_name || (f.User ? f.User.name : (f.user ? f.user.name : 'Anonymous'))
        }))
      };
    });

    res.status(200).json(formattedLectures);
  } catch (err) {
    console.error('Error fetching lectures:', err);
    res.status(500).json({ message: err.message });
  }
};

const updateLecture = async (req, res) => {
  const { error } = updateLectureSchema.validate(req.body || {});
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const lecture = await Lecture.findByPk(req.params.id);
    if (!lecture) return res.status(404).json({ message: 'Lecture not found.' });

    const { 
      speaker_name, topic, department, venue, dateTime, description, 
      image_url, assignee_name, assignee_phone, admin_phone, status,
      expenses 
    } = req.body;
    
    let updateData = { ...req.body };
    if (dateTime) {
      const dt = new Date(dateTime);
      if (Number.isNaN(dt.getTime())) {
        return res.status(400).json({ message: 'Invalid dateTime provided.' });
      }
      updateData.lecture_date = dt.toISOString().split('T')[0];
      updateData.lecture_time = dt.toTimeString().split(' ')[0];
    }

    await lecture.update(updateData);

    if (expenses && Array.isArray(expenses)) {
      // Simple approach: delete old expenses and re-add
      await db.LectureExpense.destroy({ where: { lecture_id: lecture.id } });
      const expenseData = expenses.map(exp => ({
        ...exp,
        lecture_id: lecture.id
      }));
      await db.LectureExpense.bulkCreate(expenseData);
    }

    res.status(200).json({ message: 'Lecture updated successfully.', lecture });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findByPk(req.params.id);
    if (!lecture) return res.status(404).json({ message: 'Lecture not found.' });

    await lecture.destroy();
    res.status(200).json({ message: 'Lecture deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createLecture,
  getAllLectures,
  updateLecture,
  deleteLecture
};
