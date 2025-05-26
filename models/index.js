const { Sequelize } = require('sequelize');
const { sequelize } = require('../config/db');

const User = require('./User')(sequelize);
const Task = require('./Task')(sequelize);

// Associations
User.hasMany(Task, { foreignKey: 'userId', onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'userId' });

module.exports = { sequelize, User, Task, };
