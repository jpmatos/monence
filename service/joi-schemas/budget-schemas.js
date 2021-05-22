const Joi = require('joi');

const postBudgetSchema = Joi.object({
    date: Joi.date().iso().required(),
    value: Joi.number().precision(2).positive().max(1000000).required(),
    period: Joi.string().pattern(/^week$|^month$|^year$/).required()
})

const putBudgetSchema = Joi.object({
    date: Joi.date().iso().optional(),
    value: Joi.number().precision(2).positive().max(1000000).optional(),
    period: Joi.string().pattern(/^week$|^month$|^year$/).required()
})

module.exports = {postBudgetSchema, putBudgetSchema}