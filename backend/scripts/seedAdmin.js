const { User, sequelize } = require('../models');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const seedAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to database.');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const [adminUser, adminCreated] = await User.findOrCreate({
      where: { email: 'admin@example.com' },
      defaults: {
        name: 'Admin User',
        phone: '1234567890',
        password_hash: hashedPassword,
        role: 'admin'
      }
    });

    if (adminCreated) {
      console.log('Admin user created successfully!');
    }

    const securityPassword = await bcrypt.hash('security123', salt);
    const [securityUser, securityCreated] = await User.findOrCreate({
      where: { email: 'security@example.com' },
      defaults: {
        name: 'Security Guard',
        phone: '0987654321',
        password_hash: securityPassword,
        role: 'security'
      }
    });

    if (securityCreated) {
      console.log('Security user created successfully!');
    } else {
      console.log('Security user already exists.');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    await sequelize.close();
  }
};

seedAdmin();
