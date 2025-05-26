const { DataTypes } = require('sequelize');

const Task = (sequelize) =>
  sequelize.define('Task', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM('pending', 'in-progress', 'completed'),
      defaultValue: 'pending',
    },
    timeSpent: {
      type: DataTypes.INTEGER, // in minutes
      defaultValue: 0,
    },
  });


module.exports = Task;