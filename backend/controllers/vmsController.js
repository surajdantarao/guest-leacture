const Joi = require('joi');
const db = require('../models');
const visitorController = require('./visitorController');
const passService = require('../services/passService');
const QRCode = require('qrcode');

const registerVisitor = (req, res) => visitorController.requestVisit(req, res);

const adminApprove = async (req, res) => {
  const schema = Joi.object({
    visitor_id: Joi.number().integer().positive().required()
  });

  const { error } = schema.validate(req.body || {});
  if (error) return res.status(400).json({ message: error.details[0].message });

  req.params = { id: String(req.body.visitor_id) };
  return visitorController.approveVisit(req, res);
};

const adminReject = async (req, res) => {
  const schema = Joi.object({
    visitor_id: Joi.number().integer().positive().required(),
    rejection_reason: Joi.string().trim().min(3).required()
  });

  const { error } = schema.validate(req.body || {});
  if (error) return res.status(400).json({ message: error.details[0].message });

  req.params = { id: String(req.body.visitor_id) };
  return visitorController.rejectVisit(req, res);
};

const getPassById = async (req, res) => {
  try {
    const pass = await db.Pass.findByPk(req.params.id, {
      include: [{ model: db.Visitor }]
    });

    if (!pass) return res.status(404).json({ message: 'Pass not found.' });

    await passService.invalidateExpiredPass(pass);
    const passPresentation = await passService.getPassPresentation(pass);

    return res.status(200).json({
      ...passPresentation,
      visitor: pass.Visitor
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getPassQrImage = async (req, res) => {
  try {
    const pass = await db.Pass.findByPk(req.params.id);
    if (!pass) return res.status(404).json({ message: 'Pass not found.' });

    await passService.invalidateExpiredPass(pass);

    const qrPayload = passService.buildPassPayload(pass);
    const pngBuffer = await QRCode.toBuffer(qrPayload, {
      type: 'png',
      width: 512,
      margin: 2
    });

    res.setHeader('Content-Type', 'image/png');
    return res.status(200).send(pngBuffer);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const parseQrPayload = (qrCode) => {
  try {
    const parsed = JSON.parse(qrCode);
    if (parsed && parsed.type === 'visitor_pass' && parsed.qr_code) {
      return parsed.qr_code;
    }
  } catch (error) {
    // raw token
  }
  return qrCode;
};

const scanEntry = async (req, res) => {
  const schema = Joi.object({
    qr_code: Joi.string().required()
  });

  const { error } = schema.validate(req.body || {});
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const scannedCode = parseQrPayload(req.body.qr_code);
    const pass = await db.Pass.findOne({
      where: { qr_code: scannedCode },
      include: [{ model: db.Visitor }]
    });

    if (!pass) return res.status(404).json({ message: 'Invalid QR code.' });

    await passService.invalidateExpiredPass(pass);

    if (pass.status !== 'active') {
      return res.status(400).json({ message: `Pass is ${pass.status}.` });
    }

    if (!pass.Visitor || pass.Visitor.status !== 'approved') {
      return res.status(400).json({ message: 'Visitor is not approved.' });
    }

    const activeLog = await db.VisitorLog.findOne({
      where: {
        visitor_id: pass.visitor_id,
        check_out_time: null
      }
    });

    if (activeLog) {
      return res.status(409).json({ message: 'Duplicate entry denied. Visitor already inside.' });
    }

    const log = await db.VisitorLog.create({
      visitor_id: pass.visitor_id,
      check_in_time: new Date(),
      verified_by: req.userId || null
    });

    return res.status(200).json({
      message: 'Entry marked successfully.',
      action: 'checkin',
      visitor: pass.Visitor,
      visitor_id: pass.visitor_id,
      entry_time: log.check_in_time,
      log
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const scanExit = async (req, res) => {
  const schema = Joi.object({
    qr_code: Joi.string().required()
  });

  const { error } = schema.validate(req.body || {});
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const scannedCode = parseQrPayload(req.body.qr_code);
    const pass = await db.Pass.findOne({
      where: { qr_code: scannedCode },
      include: [{ model: db.Visitor }]
    });

    if (!pass) return res.status(404).json({ message: 'Invalid QR code.' });

    await passService.invalidateExpiredPass(pass);
    if (pass.status !== 'active') {
      return res.status(400).json({ message: `Pass is ${pass.status}.` });
    }

    const activeLog = await db.VisitorLog.findOne({
      where: {
        visitor_id: pass.visitor_id,
        check_out_time: null
      },
      order: [['check_in_time', 'DESC']]
    });

    if (!activeLog) {
      return res.status(409).json({ message: 'No active entry found for this pass.' });
    }

    activeLog.check_out_time = new Date();
    await activeLog.save();

    return res.status(200).json({
      message: 'Exit marked successfully.',
      action: 'checkout',
      visitor: pass.Visitor,
      visitor_id: pass.visitor_id,
      entry_time: activeLog.check_in_time,
      exit_time: activeLog.check_out_time,
      log: activeLog
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  registerVisitor,
  adminApprove,
  adminReject,
  getPassById,
  getPassQrImage,
  scanEntry,
  scanExit
};
