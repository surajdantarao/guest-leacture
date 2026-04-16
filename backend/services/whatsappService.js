const { normalizePhone } = require('../utils/phone');

const createWaLink = (phone, message) => {
  const normalizedPhone = normalizePhone(phone);
  const phoneDigits = normalizedPhone ? normalizedPhone.replace(/\D/g, '') : '';
  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`;
};

const sendViaCallMeBot = async (phone, message) => {
  const apiKey = process.env.WHATSAPP_CALLMEBOT_API_KEY;
  if (!apiKey) {
    return {
      sent: false,
      provider: 'callmebot',
      reason: 'missing_api_key'
    };
  }

  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone) {
    return {
      sent: false,
      provider: 'callmebot',
      reason: 'invalid_phone'
    };
  }

  const url =
    `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(normalizedPhone)}` +
    `&text=${encodeURIComponent(message)}&apikey=${encodeURIComponent(apiKey)}`;

  const response = await fetch(url, { method: 'GET' });
  if (!response.ok) {
    const text = await response.text();
    return {
      sent: false,
      provider: 'callmebot',
      reason: `http_${response.status}`,
      details: text
    };
  }

  return {
    sent: true,
    provider: 'callmebot'
  };
};

const sendViaTwilio = async (phone, message, options = {}) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_FROM;

  if (!accountSid || !authToken || !fromNumber) {
    return {
      sent: false,
      provider: 'twilio',
      reason: 'missing_twilio_config'
    };
  }

  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone) {
    return {
      sent: false,
      provider: 'twilio',
      reason: 'invalid_phone'
    };
  }

  let twilio;
  try {
    twilio = require('twilio');
  } catch (error) {
    return {
      sent: false,
      provider: 'twilio',
      reason: 'twilio_sdk_missing'
    };
  }

  const client = twilio(accountSid, authToken);
  const payload = {
    from: fromNumber.startsWith('whatsapp:') ? fromNumber : `whatsapp:${fromNumber}`,
    to: `whatsapp:${normalizedPhone}`,
    body: message
  };

  if (options.mediaUrl) {
    payload.mediaUrl = [options.mediaUrl];
  }

  try {
    const response = await client.messages.create(payload);
    return {
      sent: true,
      provider: 'twilio',
      messageSid: response.sid
    };
  } catch (error) {
    return {
      sent: false,
      provider: 'twilio',
      reason: error.message || 'send_failed'
    };
  }
};

const sendWhatsAppMessage = async (phone, message, options = {}) => {
  const waLink = createWaLink(phone, message);
  const provider = (process.env.WHATSAPP_PROVIDER || '').toLowerCase();

  try {
    if (provider === 'twilio') {
      const result = await sendViaTwilio(phone, message, options);
      return { ...result, waLink };
    }

    if (provider === 'callmebot') {
      const result = await sendViaCallMeBot(phone, message);
      return { ...result, waLink };
    }

    console.log(`[WhatsApp Service] Provider not configured. Message prepared for ${phone}.`);
    return {
      sent: false,
      provider: provider || 'none',
      reason: 'provider_not_configured',
      waLink
    };
  } catch (error) {
    return {
      sent: false,
      provider: provider || 'none',
      reason: error.message || 'send_failed',
      waLink
    };
  }
};

const notifyVisitorStatus = async (visitor, status, options = {}) => {
  const visitorName = visitor.name || (visitor.User ? visitor.User.name : 'Visitor');
  const visitorPhone = visitor.whatsapp_number || visitor.phone || (visitor.User ? (visitor.User.whatsapp_number || visitor.User.phone) : null);
  const visitDate = visitor.visit_date || 'your scheduled date';
  const visitTime = visitor.visit_time || 'scheduled time';

  let message = `Hello ${visitorName}, your visit request for ${visitDate} has been ${status}.`;

  if (status === 'approved') {
    message += `\nDigital pass generated for ${visitDate} at ${visitTime}.`;
    if (options.passId) {
      const base = process.env.PUBLIC_API_BASE_URL || '';
      const passLink = base ? `${base.replace(/\/$/, '')}/api/pass/${options.passId}` : `/api/pass/${options.passId}`;
      message += `\nPass link: ${passLink}`;
    }
    if (options.qrCode) {
      message += `\nPass code: ${options.qrCode}`;
    }
    if (options.qrImageUrl) {
      message += `\nQR image: ${options.qrImageUrl}`;
    }
    message += '\nShow this pass QR at the gate for entry and exit.';
  }

  if (status === 'rejected') {
    const reason = options.rejectionReason || visitor.rejection_reason || 'Not specified by admin';
    message += `\nReason: ${reason}`;
  }

  return sendWhatsAppMessage(visitorPhone, message, options);
};

const sendVisitReminder = async (visitor, hoursBefore) => {
  const message = `Reminder: You have a scheduled visit in ${hoursBefore} hours. Please arrive on time.`;
  return sendWhatsAppMessage(visitor.User?.phone || visitor.phone, message);
};

const notifyChecklistAssignment = async (user, item, lecture) => {
  const message = `Hello ${user.name}, you have been assigned to arrange "${item}" for the lecture "${lecture.topic}".`;
  return sendWhatsAppMessage(user.phone, message);
};

const notifyLectureSchedule = async (user, lecture) => {
  const message = `New Lecture Scheduled: "${lecture.topic}" by ${lecture.speaker_name} on ${lecture.lecture_date} at ${lecture.lecture_time}.`;
  return sendWhatsAppMessage(user.phone, message);
};

module.exports = {
  sendWhatsAppMessage,
  notifyVisitorStatus,
  sendVisitReminder,
  notifyChecklistAssignment,
  notifyLectureSchedule
};
