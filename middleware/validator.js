const Joi = require('joi');

// Registration validation schema
const registerSchema = Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
        'string.min': 'The username must be at least 3 characters long'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please enter a valid email address'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'The password must be at least 6 characters long'
    })
});

// Song validation schema
const songSchema = Joi.object({
    title: Joi.string().required(),
    artist: Joi.string().required(),
    album: Joi.string().allow('', null) 
});

module.exports = { registerSchema, songSchema };