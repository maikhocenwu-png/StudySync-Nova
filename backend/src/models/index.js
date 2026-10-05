const sequelize = require('../config/database');
const User = require('./User');
const Course = require('./Course');
const Topic = require('./Topic');
const StudyMaterial = require('./StudyMaterial');
const Quiz = require('./Quiz');
const Question = require('./Question');

Course.hasMany(Topic, { foreignKey: 'course_id', onDelete: 'CASCADE' });
Topic.belongsTo(Course, { foreignKey: 'course_id' });

User.hasMany(StudyMaterial, { foreignKey: 'user_id', onDelete: 'CASCADE' });
StudyMaterial.belongsTo(User, { foreignKey: 'user_id' });
Topic.hasMany(StudyMaterial, { foreignKey: 'topic_id', onDelete: 'CASCADE' });
StudyMaterial.belongsTo(Topic, { foreignKey: 'topic_id' });

User.hasMany(Quiz, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Quiz.belongsTo(User, { foreignKey: 'user_id' });
Topic.hasMany(Quiz, { foreignKey: 'topic_id', onDelete: 'CASCADE' });
Quiz.belongsTo(Topic, { foreignKey: 'topic_id' });

Quiz.hasMany(Question, { foreignKey: 'quiz_id', onDelete: 'CASCADE' });
Question.belongsTo(Quiz, { foreignKey: 'quiz_id' });

User.belongsToMany(Course, { through: 'user_courses', foreignKey: 'user_id' });
Course.belongsToMany(User, { through: 'user_courses', foreignKey: 'course_id' });

module.exports = { sequelize, User, Course, Topic, StudyMaterial, Quiz, Question };
