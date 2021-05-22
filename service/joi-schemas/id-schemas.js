const Joi = require('joi');

const uuidSchema = Joi.string().pattern(/^[a-zA-Z0-9]{22}$/)
const userIdSchema = Joi.string().pattern(/^[0-9]{21}$/)

module.exports = {uuidSchema, userIdSchema}