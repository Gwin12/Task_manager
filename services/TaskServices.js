const { Task } = require('../models');

class TaskServices {
    static async createTask(data) {
        try {
            return await Task.create(data);
        } catch (error) {
            throw error;
        }
    }

    static async findOneTask(data) {
        try {
            return await Task.findOne({ where: data });
        } catch (error) {
            throw error;
        }
    }

    static async updateTask(task, data) {
        try {
            const { title, description, status, timeSpent } = data;
            return task.update({ title, description, status, timeSpent });
        } catch (error) {
            throw error;
        }
    }

    static async deleteTask(task) {
        try {
            return task.destroy();
        } catch (error) {
            throw error;
        }
    }

    static async findTasks(data) {
        try {
            const { page, limit, where } = data
            const tasks = await Task.findAndCountAll({
                where,
                limit: parseInt(limit),
                offset: (page - 1) * limit,
                order: [['createdAt', 'DESC']],
            });
            return tasks;
        } catch (error) {
            throw error;
        }
    }

    static async findAllUserTasks(userId) {
        try {
            return await Task.findAll({ where: { userId } });
        } catch (error) {
            throw error;
        }
    }
}


module.exports = TaskServices;