const Joi = require('@hapi/joi');

module.exports = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string()
        .trim()
        .min(8)
        .required(),
    repeat_password: Joi.ref('password')
}).with('password', 'repeat_password');
