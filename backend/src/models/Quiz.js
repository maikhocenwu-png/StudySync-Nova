const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Quiz = sequelize.define('Quiz', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  difficulty: { type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'), defaultValue: 'beginner' },
  score: { type: DataTypes.FLOAT },
  completed_at: { type: DataTypes.DATE }
}, { tableName: 'quizzes', underscored: true });

module.exports = Quiz;
