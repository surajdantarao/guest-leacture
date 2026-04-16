const crypto = require('crypto');
const QRCode = require('qrcode');
const db = require('../models');

const DEFAULT_PASS_EXPIRY_HOURS = Number(process.env.PASS_EXPIRY_HOURS || 24);

const buildPassPayload = (pass) => JSON.stringify({
  type: 'visitor_pass',
  pass_id: pass.id,
  qr_code: pass.qr_code
});

const generateQrToken = () => crypto.randomBytes(32).toString('hex');

const generatePass = async (visitor, options = {}) => {
  const existingPass = await db.Pass.findOne({
    where: { visitor_id: visitor.id }
  });

  if (existingPass) {
    return existingPass;
  }

  const now = new Date();
  const pass = await db.Pass.create({
    visitor_id: visitor.id,
    qr_code: generateQrToken(),
    status: 'active',
    generated_at: now,
    expires_at: options.expiresAt || new Date(now.getTime() + DEFAULT_PASS_EXPIRY_HOURS * 60 * 60 * 1000)
  });

  return pass;
};

const getPassPresentation = async (pass) => {
  const qrPayload = buildPassPayload(pass);
  const qrImageDataUrl = await QRCode.toDataURL(qrPayload);

  return {
    id: pass.id,
    visitor_id: pass.visitor_id,
    qr_code: pass.qr_code,
    status: pass.status,
    generated_at: pass.generated_at,
    expires_at: pass.expires_at,
    qr_payload: qrPayload,
    qr_image: qrImageDataUrl
  };
};

const isPassExpired = (pass) => !!pass.expires_at && new Date(pass.expires_at).getTime() < Date.now();

const invalidateExpiredPass = async (pass) => {
  if (pass.status === 'expired') return pass;
  if (!isPassExpired(pass)) return pass;
  pass.status = 'expired';
  await pass.save();
  return pass;
};

module.exports = {
  buildPassPayload,
  generatePass,
  getPassPresentation,
  isPassExpired,
  invalidateExpiredPass
};
