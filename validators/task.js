const Joi = require('joi');

const addTaskSchema = Joi.object({
    title: Joi.string().required().trim(),
    description: Joi.string().optional().allow("")
});

const updateTaskSchema = Joi.object({
    title: Joi.string().required().trim(),
    description: Joi.string().optional().allow(""),
    status: Joi.string().optional().valid('pending', 'in-progress', 'completed'),
    timeSpent: Joi.number().optional().allow("")
});

module.exports = { addTaskSchema, updateTaskSchema };