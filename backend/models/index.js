const sequelize = require('../config/db');
const { Sequelize, Op } = require('sequelize');
const User = require('./User');
const Visitor = require('./Visitor');
const VisitorLog = require('./VisitorLog');
const Pass = require('./Pass');
const Lecture = require('./Lecture');
const LectureChecklist = require('./LectureChecklist');
const LectureExpense = require('./LectureExpense');
const Feedback = require('./Feedback');

// User Associations
User.hasMany(Visitor, { foreignKey: 'user_id' });
Visitor.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(VisitorLog, { foreignKey: 'verified_by' });
VisitorLog.belongsTo(User, { foreignKey: 'verified_by' });

User.hasMany(LectureChecklist, { foreignKey: 'assigned_to' });
LectureChecklist.belongsTo(User, { foreignKey: 'assigned_to' });

User.hasMany(Feedback, { foreignKey: 'user_id' });
Feedback.belongsTo(User, { foreignKey: 'user_id' });

// Visitor Associations
Visitor.hasMany(VisitorLog, { foreignKey: 'visitor_id', as: 'VisitorLogs' });
VisitorLog.belongsTo(Visitor, { foreignKey: 'visitor_id' });
Visitor.hasOne(Pass, { foreignKey: 'visitor_id', as: 'Pass' });
Pass.belongsTo(Visitor, { foreignKey: 'visitor_id' });

// Lecture Associations with Cascade Delete
Lecture.hasMany(LectureChecklist, { foreignKey: 'lecture_id', onDelete: 'CASCADE', as: 'LectureChecklists' });
LectureChecklist.belongsTo(Lecture, { foreignKey: 'lecture_id' });

Lecture.hasMany(LectureExpense, { foreignKey: 'lecture_id', onDelete: 'CASCADE', as: 'LectureExpenses' });
LectureExpense.belongsTo(Lecture, { foreignKey: 'lecture_id' });

Lecture.hasMany(Feedback, { foreignKey: 'lecture_id', onDelete: 'CASCADE', as: 'Feedbacks' });
Feedback.belongsTo(Lecture, { foreignKey: 'lecture_id' });

module.exports = {
  sequelize,
  Sequelize,
  Op,
  User,
  Visitor,
  VisitorLog,
  Pass,
  Lecture,
  LectureChecklist,
  LectureExpense,
  Feedback
};
