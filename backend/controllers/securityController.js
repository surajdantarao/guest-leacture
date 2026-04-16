const db = require('../models');
const VisitorLog = db.VisitorLog;
const Visitor = db.Visitor;
const Pass = db.Pass;
const Joi = require('joi');
const passService = require('../services/passService');

const checkIn = async (req, res) => {
  const schema = Joi.object({
    visitor_id: Joi.number().integer().positive().required()
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    // Verify visitor is approved
    const visitor = await Visitor.findByPk(req.body.visitor_id);
    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found.' });
    }
    if (visitor.status !== 'approved') {
      return res.status(400).json({ message: 'Visitor is not approved for entry.' });
    }

    const activeLog = await VisitorLog.findOne({
      where: {
        visitor_id: req.body.visitor_id,
        check_out_time: null
      }
    });

    if (activeLog) {
      return res.status(409).json({ message: 'Duplicate entry denied. Visitor already inside.' });
    }

    const log = await VisitorLog.create({
      visitor_id: req.body.visitor_id,
      check_in_time: new Date(),
      verified_by: req.userId
    });

    res.status(200).json({ message: 'Visitor checked in.', log });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const checkOut = async (req, res) => {
  const schema = Joi.object({
    visitor_id: Joi.number().integer().positive().required()
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    // Find active log (checked in but not checked out)
    const log = await VisitorLog.findOne({
      where: {
        visitor_id: req.body.visitor_id,
        check_out_time: null
      },
      order: [['check_in_time', 'DESC']]
    });

    if (!log) {
      return res.status(409).json({ message: 'No active check-in found for this visitor.' });
    }

    log.check_out_time = new Date();
    await log.save();

    res.status(200).json({ message: 'Visitor checked out.', log });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const verifyQrCode = async (req, res) => {
  const schema = Joi.object({
    qr_data: Joi.string().trim().min(4).required()
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    let parsedData = null;
    let scannedCode = req.body.qr_data;
    try {
      parsedData = JSON.parse(req.body.qr_data);
      if (parsedData && parsedData.qr_code) {
        scannedCode = parsedData.qr_code;
      }
    } catch (error) {
      // raw qr token
    }

    let pass = await Pass.findOne({
      where: { qr_code: scannedCode },
      include: [{ model: Visitor }]
    });
    if (!pass && parsedData && parsedData.id && parsedData.type === 'visitor_pass') {
      pass = await Pass.findOne({
        where: { visitor_id: parsedData.id },
        include: [{ model: Visitor }]
      });
    }
    if (!pass) {
      return res.status(400).json({ message: 'Invalid QR code.' });
    }

    await passService.invalidateExpiredPass(pass);
    if (pass.status !== 'active') {
      return res.status(400).json({ message: `Pass is ${pass.status}.` });
    }

    const visitor = pass.Visitor;
    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found.' });
    }
    if (visitor.status !== 'approved') {
      return res.status(400).json({ message: `Visitor is ${visitor.status}. Entry denied.` });
    }

    // Check if already checked in (and not checked out)
    const activeLog = await VisitorLog.findOne({
      where: {
        visitor_id: visitor.id,
        check_out_time: null
      }
    });

    if (activeLog) {
       // If already checked in, maybe we check them out? Or just return error.
       // The requirement says "make their entry", so if they are already in, we might want to check them out.
      activeLog.check_out_time = new Date();
      await activeLog.save();
      return res.status(200).json({ message: 'Visitor checked out successfully.', log: activeLog, action: 'checkout' });
    }

    const log = await VisitorLog.create({
      visitor_id: visitor.id,
      check_in_time: new Date(),
      verified_by: req.userId
    });

    res.status(200).json({ message: 'Visitor checked in successfully.', log, visitor, action: 'checkin' });
  } catch (err) {
    res.status(500).json({ message: 'Error processing QR code: ' + err.message });
  }
};

module.exports = {
  checkIn,
  checkOut,
  verifyQrCode
};
