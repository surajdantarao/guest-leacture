const PHONE_REGEX = /^\+?[1-9]\d{9,14}$/;

const normalizePhone = (phone) => {
  if (!phone) return null;
  const raw = String(phone).trim();
  const hasPlus = raw.startsWith('+');
  const digits = raw.replace(/\D/g, '');
  if (!digits) return null;
  return hasPlus ? `+${digits}` : `+${digits}`;
};

const isValidPhone = (phone) => {
  const normalized = normalizePhone(phone);
  if (!normalized) return false;
  return PHONE_REGEX.test(normalized);
};

module.exports = {
  PHONE_REGEX,
  normalizePhone,
  isValidPhone
};
