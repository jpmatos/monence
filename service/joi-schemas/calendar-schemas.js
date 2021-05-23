const Joi = require('joi');

const postCalendarSchema = Joi.object({
    name: Joi.string().min(1).max(64).required()
})

module.exports = {postCalendarSchema}