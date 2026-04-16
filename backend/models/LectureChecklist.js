const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Lecture = require('./Lecture');
const User = require('./User');

const LectureChecklist = sequelize.define('LectureChecklist', {
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
  item_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  assigned_to: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'ready'),
    defaultValue: 'pending'
  }
}, {
  tableName: 'lecture_checklists',
  timestamps: false
});

module.exports = LectureChecklist;
