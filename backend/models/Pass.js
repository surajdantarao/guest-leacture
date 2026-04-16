const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Visitor = require('./Visitor');

const Pass = sequelize.define('Pass', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  visitor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: Visitor,
      key: 'id'
    }
  },
  qr_code: {
    type: DataTypes.STRING(128),
    allowNull: false,
    unique: true
  },
  status: {
    type: DataTypes.ENUM('active', 'used', 'expired', 'revoked'),
    allowNull: false,
    defaultValue: 'active'
  },
  generated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'passes',
  timestamps: false
});

module.exports = Pass;
