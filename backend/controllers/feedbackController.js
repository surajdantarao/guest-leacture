const db = require('../models');
const Feedback = db.Feedback;
const User = db.User;
const Joi = require('joi');

const submitFeedback = async (req, res) => {
  const schema = Joi.object({
    lecture_id: Joi.number().required(),
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().allow('', null),
    guest_name: Joi.string().allow('', null)
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const feedback = await Feedback.create({
      lecture_id: req.body.lecture_id,
      user_id: req.userId || null,
      guest_name: req.body.guest_name || null,
      rating: req.body.rating,
      comment: req.body.comment
    });
    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getFeedbackByLecture = async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll({
      where: { lecture_id: req.params.lectureId },
      include: [{ model: User, attributes: ['name'] }]
    });
    res.status(200).json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  submitFeedback,
  getFeedbackByLecture
};
