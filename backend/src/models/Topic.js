const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Topic = sequelize.define('Topic', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'topics', underscored: true });

module.exports = Topic;
