const db = require('../models');
const User = db.User;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

/**
 * Register Controller
 * Correctly hashes and saves password into 'password_hash' 
 * (which maps to 'password' column in DB)
 */
const register = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    whatsapp_number: Joi.string().allow('', null),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'visitor', 'guest', 'security', 'staff', 'visitor_security').default('visitor')
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      whatsapp_number: req.body.whatsapp_number,
      password_hash: hashedPassword, // Matches model property
      role: req.body.role || 'visitor'
    });

    res.status(201).json({ message: 'User registered successfully!' });

  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Login Controller
 * Correctly reads 'password_hash' and compares it
 */
const login = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    // 1. Fetch user by email
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      console.warn(`Login failed: User with email ${req.body.email} not found.`);
      return res.status(404).json({ message: 'Invalid email or password' });
    }

    // 2. bcrypt.compare
    const passwordIsValid = await bcrypt.compare(
      req.body.password,
      user.password_hash // Now correctly mapped to DB column via Sequelize
    );

    if (!passwordIsValid) {
      console.warn(`Login failed: Incorrect password for user ${req.body.email}.`);
      return res.status(401).json({
        accessToken: null,
        message: 'Invalid email or password'
      });
    }

    // 3. Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret_for_dev', 
      { expiresIn: 86400 } // 24 hours
    );

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken: token
    });

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  register,
  login
};
