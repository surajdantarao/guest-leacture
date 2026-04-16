const { sequelize } = require('../models');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const initDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // WARNING: This will drop all tables and recreate them!
    // This is the easiest way to ensure the schema matches the models during development.
    await sequelize.sync({ force: true });
    
    console.log('All tables have been recreated with the new schema.');
    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

initDb();
