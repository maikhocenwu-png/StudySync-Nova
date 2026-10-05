const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Question = sequelize.define('Question', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  prompt: { type: DataTypes.TEXT, allowNull: false },
  choices: { type: DataTypes.JSONB, allowNull: false },
  correct_index: { type: DataTypes.INTEGER, allowNull: false },
  user_answer_index: { type: DataTypes.INTEGER }
}, { tableName: 'questions', underscored: true });

module.exports = Question;
