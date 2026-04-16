const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Lecture = sequelize.define('Lecture', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  speaker_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  topic: {
    type: DataTypes.STRING,
    allowNull: false
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false
  },
  venue: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lecture_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  lecture_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  image_url: {
    type: DataTypes.STRING
  },
  assignee_name: {
    type: DataTypes.STRING
  },
  assignee_phone: {
    type: DataTypes.STRING
  },
  admin_phone: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'completed', 'cancelled'),
    defaultValue: 'scheduled'
  }
}, {
  tableName: 'lectures',

  // 🔥 MOST IMPORTANT FIX
  timestamps: true,
  underscored: true,   // ✅ maps createdAt → created_at automatically
  paranoid: true       // uses deleted_at automatically
});


// Optional computed fields
Lecture.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  values.speakerName = values.speaker_name;
  values.imageUrl = values.image_url;
  values.assigneeName = values.assignee_name;
  values.assigneePhone = values.assignee_phone;
  values.adminPhone = values.admin_phone;

  values.dateTime =
    values.lecture_date && values.lecture_time
      ? `${values.lecture_date}T${values.lecture_time}`
      : null;

  return values;
};

module.exports = Lecture;