const Joi = require('joi');

const postItemSingleSchema = Joi.object({
    title: Joi.string().min(1).max(64).required(),
    start: Joi.date().iso().required(),
    value: Joi.number().precision(2).positive().max(1000000).required(),
    type: Joi.string().pattern(/^gain$|^expense$/).required()
})

const putItemSingleSchema = Joi.object({
    title: Joi.string().min(1).max(64).optional(),
    start: Joi.date().iso().optional(),
    value: Joi.number().precision(2).positive().max(1000000).optional(),
})

const postItemRecurrentSchema = Joi.object({
    title: Joi.string().min(1).max(64).required(),
    start: Joi.date().iso().required(),
    end: Joi.date().iso().required(),
    value: Joi.number().precision(2).positive().max(1000000).required(),
    type: Joi.string().pattern(/^gain$|^expense$/).required()
})

const putItemRecurrentSchema = Joi.object({
    title: Joi.string().min(1).max(64).optional(),
    start: Joi.date().iso().optional(),
    end: Joi.date().iso().optional(),
    value: Joi.number().precision(2).positive().max(1000000).optional(),
})

module.exports = {postItemSingleSchema, putItemSingleSchema, postItemRecurrentSchema, putItemRecurrentSchema}