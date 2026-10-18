const app = require('./app');
const { sequelize, User } = require('./models');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const autoSeed = async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const adminHash = await bcrypt.hash('admin123', salt);
    await User.findOrCreate({
      where: { email: 'admin@example.com' },
      defaults: {
        name: 'Admin User',
        phone: '1234567890',
        password_hash: adminHash,
        role: 'admin'
      }
    });

    const secHash = await bcrypt.hash('security123', salt);
    await User.findOrCreate({
      where: { email: 'security@example.com' },
      defaults: {
        name: 'Security Guard',
        phone: '0987654321',
        password_hash: secHash,
        role: 'security'
      }
    });
    console.log('Default accounts verified (Admin & Security).');
  } catch (err) {
    console.error('Auto-seed check error:', err.message);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // Optional: process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

sequelize.sync() // Automatically create tables if they don't exist
  .then(async () => {
    console.log('Database synchronized.');
    await autoSeed();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })

  .catch(err => {
    console.error('Failed to sync db:', err);
    process.exit(1);
  });
