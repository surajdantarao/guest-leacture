const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided.' });
  }

  const bearerToken = token.split(' ')[1]; // Expecting "Bearer <token>"

  if (!bearerToken) {
    return res.status(403).json({ message: 'Malformed token.' });
  }

  jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

const optionalVerifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return next();
  }

  const bearerToken = token.split(' ')[1];

  if (!bearerToken) {
    return next();
  }

  jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // If token is provided but invalid, we still allow guest access but log the error
      console.warn('Optional token provided but invalid');
      return next();
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Require Admin Role!' });
  }
  next();
};

const isSecurity = (req, res, next) => {
  if (req.userRole !== 'security' && req.userRole !== 'visitor_security' && req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Require Security Role!' });
  }
  next();
};

const isStaff = (req, res, next) => {
  if (req.userRole !== 'staff' && req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Require Staff Role!' });
  }
  next();
};

module.exports = {
  verifyToken,
  optionalVerifyToken,
  isAdmin,
  isSecurity,
  isStaff
};
