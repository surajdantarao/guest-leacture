const Joi = require('joi');
const db = require('../models');
const whatsappService = require('../services/whatsappService');
const passService = require('../services/passService');
const { isValidPhone, normalizePhone } = require('../utils/phone');

const Visitor = db.Visitor;
const User = db.User;

const ensurePhone = (value, fieldName) => {
  const normalized = normalizePhone(value);
  if (!normalized || !isValidPhone(normalized)) {
    throw new Error(`${fieldName} must be a valid phone number in international format.`);
  }
  return normalized;
};

const getLatestLog = (visitor) =>
  visitor.VisitorLogs && visitor.VisitorLogs.length > 0 ? visitor.VisitorLogs[0] : null;

const formatDateTime = (value) => {
  if (!value) return null;
  return new Date(value).toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatVisitor = (visitor) => {
  const visitorJson = visitor.toJSON();
  const latestLog = getLatestLog(visitor);
  return {
    ...visitorJson,
    checkIn: latestLog && latestLog.check_in_time
      ? formatDateTime(latestLog.check_in_time)
      : null,
    checkOut: latestLog && latestLog.check_out_time
      ? formatDateTime(latestLog.check_out_time)
      : null,
    checkInAt: latestLog ? latestLog.check_in_time : null,
    checkOutAt: latestLog ? latestLog.check_out_time : null
  };
};

const requestVisit = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    whatsapp_number: Joi.string().allow('', null),
    whatsappNumber: Joi.string().allow('', null),
    visitor_category: Joi.string().required(),
    student_name: Joi.string().allow('', null),
    student_roll: Joi.string().allow('', null),
    department: Joi.string().required(),
    purpose: Joi.string().required(),
    person_to_meet: Joi.string().required(),
    visit_date: Joi.date().required(),
    visit_time: Joi.string().required(),
    id_proof: Joi.string().allow('', null)
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    let idProofValue = req.body.id_proof;
    if (req.file) {
      idProofValue = `/uploads/${req.file.filename}`;
    }

    const phone = ensurePhone(req.body.phone, 'phone');
    const whatsappInput = req.body.whatsapp_number || req.body.whatsappNumber || req.body.phone;
    const whatsappNumber = ensurePhone(whatsappInput, 'whatsapp_number');

    const visitor = await Visitor.create({
      user_id: req.userId || null,
      name: req.body.name,
      email: req.body.email,
      phone,
      whatsapp_number: whatsappNumber,
      visitor_category: req.body.visitor_category,
      student_name: req.body.student_name,
      student_roll: req.body.student_roll,
      department: req.body.department,
      purpose: req.body.purpose,
      person_to_meet: req.body.person_to_meet,
      visit_date: req.body.visit_date,
      visit_time: req.body.visit_time,
      id_proof: idProofValue,
      status: 'pending'
    });

    res.status(201).json(visitor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const approveVisit = async (req, res) => {
  try {
    const visitor = await Visitor.findByPk(req.params.id, {
      include: [{ model: User }, { model: db.Pass, as: 'Pass' }]
    });

    if (!visitor) {
      return res.status(404).json({ message: 'Visitor request not found.' });
    }

    const pass = await passService.generatePass(visitor);
    if (pass.status !== 'active') {
      pass.status = 'active';
      await pass.save();
    }

    const passPresentation = await passService.getPassPresentation(pass);
    const configuredBase = (process.env.PUBLIC_API_BASE_URL || '').trim().replace(/\/$/, '');
    const requestBase = `${req.protocol}://${req.get('host')}`;
    const publicApiBase = configuredBase || requestBase;
    const qrImageUrl = `${publicApiBase}/api/pass/${pass.id}/qr-image`;

    visitor.status = 'approved';
    visitor.rejection_reason = null;
    visitor.qr_code = passPresentation.qr_image;
    await visitor.save();

    const whatsapp = await whatsappService.notifyVisitorStatus(visitor, 'approved', {
      passId: pass.id,
      qrCode: pass.qr_code,
      qrImageUrl,
      mediaUrl: qrImageUrl
    });

    res.status(200).json({
      message: 'Visit approved and pass generated.',
      visitor,
      pass: passPresentation,
      whatsapp
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const rejectVisit = async (req, res) => {
  const schema = Joi.object({
    rejection_reason: Joi.string().trim().min(3).required()
  });

  const { error } = schema.validate(req.body || {});
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const visitor = await Visitor.findByPk(req.params.id, {
      include: [{ model: User }, { model: db.Pass, as: 'Pass' }]
    });

    if (!visitor) return res.status(404).json({ message: 'Visitor request not found.' });

    visitor.status = 'rejected';
    visitor.rejection_reason = req.body.rejection_reason.trim();
    await visitor.save();

    if (visitor.Pass && visitor.Pass.status !== 'revoked') {
      visitor.Pass.status = 'revoked';
      await visitor.Pass.save();
    }

    const whatsapp = await whatsappService.notifyVisitorStatus(visitor, 'rejected', {
      rejectionReason: visitor.rejection_reason
    });

    res.status(200).json({
      message: 'Visit rejected.',
      visitor,
      whatsapp
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.findAll({
      include: [
        { model: User, attributes: ['name', 'phone', 'whatsapp_number', 'email'] },
        { model: db.Pass, as: 'Pass' },
        {
          model: db.VisitorLog,
          as: 'VisitorLogs',
          limit: 1,
          order: [['check_in_time', 'DESC']]
        }
      ]
    });

    res.status(200).json(visitors.map(formatVisitor));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.findAll({
      where: { user_id: req.userId },
      include: [
        { model: db.Pass, as: 'Pass' },
        {
          model: db.VisitorLog,
          as: 'VisitorLogs',
          limit: 1,
          order: [['check_in_time', 'DESC']]
        }
      ]
    });

    res.status(200).json(visitors.map(formatVisitor));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateVisitor = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string(),
    whatsapp_number: Joi.string(),
    whatsappNumber: Joi.string(),
    visitor_category: Joi.string(),
    student_name: Joi.string().allow('', null),
    student_roll: Joi.string().allow('', null),
    department: Joi.string(),
    purpose: Joi.string(),
    person_to_meet: Joi.string(),
    visit_date: Joi.date(),
    visit_time: Joi.string(),
    status: Joi.string().valid('pending', 'approved', 'rejected')
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const visitor = await Visitor.findByPk(req.params.id);
    if (!visitor) return res.status(404).json({ message: 'Visitor not found.' });

    const fieldsToUpdate = [
      'name', 'email', 'visitor_category', 'student_name',
      'student_roll', 'department', 'purpose', 'person_to_meet',
      'visit_date', 'visit_time', 'status'
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) visitor[field] = req.body[field];
    });

    if (req.body.phone !== undefined) {
      visitor.phone = ensurePhone(req.body.phone, 'phone');
    }

    if (req.body.whatsapp_number !== undefined || req.body.whatsappNumber !== undefined) {
      const whatsappInput = req.body.whatsapp_number ?? req.body.whatsappNumber;
      visitor.whatsapp_number = ensurePhone(whatsappInput, 'whatsapp_number');
    }

    if (req.file) {
      visitor.id_proof = `/uploads/${req.file.filename}`;
    }

    await visitor.save();
    res.status(200).json(visitor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const visitors = await Visitor.findAll({
      attributes: ['status', 'visitor_category', 'department', 'visit_date'],
      raw: true
    });

    const activeLogs = await db.VisitorLog.count({
      where: { check_out_time: null }
    });

    const completedLogs = await db.VisitorLog.count({
      where: {
        check_out_time: { [db.Op.ne]: null }
      }
    });

    const summary = visitors.reduce((acc, visitor) => {
      acc.total += 1;
      if (visitor.status === 'approved') acc.approved += 1;
      if (visitor.status === 'pending') acc.pending += 1;
      if (visitor.status === 'rejected') acc.rejected += 1;
      return acc;
    }, { total: 0, approved: 0, pending: 0, rejected: 0 });

    const categoriesMap = visitors.reduce((acc, visitor) => {
      const key = visitor.visitor_category || 'Unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const departmentsMap = visitors.reduce((acc, visitor) => {
      const key = visitor.department || 'Unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const timelineMap = visitors.reduce((acc, visitor) => {
      if (!visitor.visit_date) return acc;
      const dateKey = new Date(visitor.visit_date).toISOString().split('T')[0];
      acc[dateKey] = (acc[dateKey] || 0) + 1;
      return acc;
    }, {});

    const categories = Object.entries(categoriesMap).map(([visitor_category, count]) => ({
      visitor_category,
      count
    }));

    const departments = Object.entries(departmentsMap).map(([department, count]) => ({
      department,
      count
    }));

    const timeline = Object.entries(timelineMap)
      .map(([visit_date, count]) => ({ visit_date, count }))
      .sort((a, b) => new Date(a.visit_date) - new Date(b.visit_date))
      .slice(-7);

    res.status(200).json({
      summary,
      active: activeLogs,
      completed: completedLogs,
      categories,
      departments,
      timeline
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(200).json({
      summary: { total: 0, approved: 0, pending: 0, rejected: 0 },
      active: 0,
      completed: 0,
      categories: [],
      departments: [],
      timeline: []
    });
  }
};

module.exports = {
  requestVisit,
  getAllVisitors,
  getUserVisitors,
  approveVisit,
  rejectVisit,
  updateVisitor,
  getDashboardStats
};
