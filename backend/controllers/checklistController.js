const db = require('../models');
const LectureChecklist = db.LectureChecklist;
const Lecture = db.Lecture;
const User = db.User;
const whatsappService = require('../services/whatsappService');
const Joi = require('joi');

const createChecklistItem = async (req, res) => {
  const schema = Joi.object({
    lecture_id: Joi.number().required(),
    item_name: Joi.string().required(),
    assigned_to: Joi.number().optional()
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const item = await LectureChecklist.create({
        lecture_id: req.body.lecture_id,
        item_name: req.body.item_name,
        assigned_to: req.body.assigned_to,
        status: 'pending'
    });

    if (req.body.assigned_to) {
        const user = await User.findByPk(req.body.assigned_to);
        const lecture = await Lecture.findByPk(req.body.lecture_id);
        if (user && lecture) {
            await whatsappService.notifyChecklistAssignment(user, item.item_name, lecture);
        }
    }

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getChecklistByLecture = async (req, res) => {
  try {
    const items = await LectureChecklist.findAll({
      where: { lecture_id: req.params.lectureId },
      include: [{ model: User, attributes: ['name', 'phone'] }]
    });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateItemStatus = async (req, res) => {
    const schema = Joi.object({
        status: Joi.string().valid('pending', 'ready').required()
    });

    const { error } = schema.validate(req.body || {});
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const item = await LectureChecklist.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        item.status = req.body.status;
        await item.save();

        res.status(200).json({ message: 'Status updated', item });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
  createChecklistItem,
  getChecklistByLecture,
  updateItemStatus
};
