const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Lecture = require('./Lecture');

const LectureExpense = sequelize.define('LectureExpense', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  lecture_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Lecture,
      key: 'id'
    }
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'lecture_expenses',
  timestamps: false
});

module.exports = LectureExpense;
