const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { sequelize } = require('../models');

const updateSchema = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Using alter: true will add missing columns without dropping existing data
    await sequelize.sync({ alter: true });
    
    console.log('Database schema synchronized successfully (alter: true).');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

updateSchema();
