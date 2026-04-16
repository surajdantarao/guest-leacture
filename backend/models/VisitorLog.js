const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Visitor = require('./Visitor');
const User = require('./User');

const VisitorLog = sequelize.define('VisitorLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  visitor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Visitor,
      key: 'id'
    }
  },
  check_in_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'entry_time'
  },
  check_out_time: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'exit_time'
  },
  verified_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  tableName: 'logs',
  timestamps: false
});

module.exports = VisitorLog;
