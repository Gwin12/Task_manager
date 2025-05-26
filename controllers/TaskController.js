const TaskServices = require('../services/TaskServices');
const UserServices = require('../services/UserServices');
const { successResponse, errorResponse } = require('../utils/responses');
const { addTaskSchema, updateTaskSchema } = require('../validators/task');

class TaskController {
    static async createTask(req, res, next) {
        try {
            const userId = req.userId
            let { value, error } = addTaskSchema.validate(req.body);
            if (error) return errorResponse(res, 400, error?.details[0]?.message);
            value.userId = userId;
            const task = await TaskServices.createTask(value);
            return successResponse(res, 201, "Task created successfully.", task);
        } catch (error) {
            next(error)
        }
    }

    static async getTasks(req, res, next) {
        try {
            const { page = 1, limit = 10, status } = req.query;
            const where = { userId: req.userId };
            if (status) where.status = status;
            const tasks = await TaskServices.findTasks({ where, page, limit });
            return successResponse(res, 200, "Tasks retrieved successfully.", {
                tasks: tasks.rows, total: tasks.count,
                page: parseInt(page)
            });
        } catch (error) {
            next(error)
        }
    }

    static async updateTask(req, res, next) {
        try {
            const data = { id: req.params.id, userId: req.userId };
            let { value, error } = updateTaskSchema.validate(req.body);
            if (error) return errorResponse(res, 400, error?.details[0]?.message)
            const task = await TaskServices.findOneTask(data)
            if (!task) return errorResponse(res, 404, "Task not found");
            task.timeSpent = value.timeSpent ? value.timeSpent : task.timeSpent;
            task.status = value.status ? value.status : task.status;
            await TaskServices.updateTask(task, value);
            return successResponse(res, 200, "Task updated successfully.", task);
        } catch (error) {
            next(error)
        }
    }

    static async deleteTask(req, res, next) {
        try {
            const data = { id: req.params.id, userId: req.userId };
            const task = await TaskServices.findOneTask(data)
            if (!task) return errorResponse(res, 404, "Task not found");
            await TaskServices.deleteTask(task);
            return successResponse(res, 200, "Task deleted successfully.");
        } catch (error) {
            next(error)
        }
    }

    static async reportTime(req, res, next) {
        try {
            const tasks = await TaskServices.findAllUserTasks(req.userId);
            if (!tasks) return errorResponse(res, 404, "Tasks not found");
            const totalMinutes = tasks.reduce((acc, task) => acc + (task.timeSpent || 0), 0);
            return successResponse(res, 200, "Tasks retrieved successfully.", { totalMinutes });
        } catch (error) {
            next(error)
        }
    }

    static async taskReport(req, res, next) {
        try {
            const user = await UserServices.findUserData({ id: req.params.id });
            if (!user) return errorResponse(res, 404, "User with that id not found");
            const tasks = await TaskServices.findAllUserTasks(req.params.id);
            if (!tasks.length) return errorResponse(res, 404, "User does not have any tasks.");
            const total = tasks.length;
            const completed = tasks.filter(task => task.status === 'completed').length;
            const pending = tasks.filter(task => task.status === 'pending').length;
            const inProgress = tasks.filter(task => task.status === 'in-progress').length;
            return successResponse(res, 200, "Tasks retrieved successfully.", {
                total, completed, pending, inProgress,
                completionRate: total ? `${((completed / total) * 100).toFixed(2)}%` : '0%',
            })
        } catch (error) {
            next(error)
        }
    }
}


module.exports = TaskController;