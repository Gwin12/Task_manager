const Joi = require('joi');

const loginUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
});

const registerSchema = Joi.object({
    username: Joi.string().required().trim(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
});

module.exports = { loginUserSchema, registerSchema };