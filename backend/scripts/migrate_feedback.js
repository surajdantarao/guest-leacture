const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

const migrate = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to database.');

    // 1. Check if guest_name exists (MySQL version)
    const columns = await sequelize.query("DESCRIBE feedback", { type: QueryTypes.SELECT });
    const hasGuestName = columns.some(c => c.Field === 'guest_name' || c.field === 'guest_name');

    if (!hasGuestName) {
      console.log('Adding guest_name column to feedback table...');
      await sequelize.query("ALTER TABLE feedback ADD COLUMN guest_name VARCHAR(255) NULL");
    }

    // 2. Make user_id nullable in MySQL
    console.log('Making user_id nullable...');
    await sequelize.query("ALTER TABLE feedback MODIFY user_id INT NULL");
    
    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};

migrate();
