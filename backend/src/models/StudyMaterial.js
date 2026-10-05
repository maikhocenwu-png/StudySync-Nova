const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StudyMaterial = sequelize.define('StudyMaterial', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  content: { type: DataTypes.TEXT, allowNull: false },
  source_name: { type: DataTypes.STRING }
}, { tableName: 'study_materials', underscored: true });

module.exports = StudyMaterial;
