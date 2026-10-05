const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Course = sequelize.define('Course', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  school: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Brooklyn College' },
  code: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'courses', underscored: true });

module.exports = Course;
