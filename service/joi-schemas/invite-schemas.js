const Joi = require('joi');

const postInviteSchema = Joi.object({
    calendarId: Joi.string().pattern(/^[a-zA-Z0-9]{22}$/),
    email: Joi.string().pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/),
    role: Joi.string().pattern(/^Viewer$|^Editor$/).required()
})

module.exports = {postInviteSchema}