const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Visitor = sequelize.define('Visitor', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  whatsapp_number: {
    type: DataTypes.STRING,
    allowNull: false
  },
  visitor_category: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Guest'
  },
  student_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  student_roll: {
    type: DataTypes.STRING,
    allowNull: true
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false
  },
  purpose: {
    type: DataTypes.STRING,
    allowNull: false
  },
  person_to_meet: {
    type: DataTypes.STRING,
    allowNull: false
  },
  visit_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  visit_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  id_proof: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  rejection_reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  qr_code: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  notified4h: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  notified1h: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  }
}, {
  tableName: 'visitors',
  timestamps: false
});

Visitor.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values.visitorCategory = values.visitor_category;
  values.studentName = values.student_name;
  values.studentRoll = values.student_roll;
  values.personToMeet = values.person_to_meet;
  values.idProof = values.id_proof;
  values.visitDate = values.visit_date;
  values.visitTime = values.visit_time;
  values.whatsappNumber = values.whatsapp_number;
  values.rejectionReason = values.rejection_reason;
  return values;
};

module.exports = Visitor;
