const express = require('express');
const router = express.Router();
const calendarController = require('./controller/calendar-controller')

function calendarWebApi(){
    /* GET hello. */
    router.get('/hello', (req, res, next) => {
        calendarController.hello(req, res, next)
    })
    router.get('/:calendarId', (req, res, next) => {
        calendarController.getCalendar(req, res, next)
    })

    //Single
    router.post('/:calendarId/item/single', (req, res, next) => {
        calendarController.postItem(req, res, next)
    })

    router.delete('/:calendarId/item/single/:itemId', (req, res, next) => {
        calendarController.deleteItem(req, res, next)
    })

    router.put('/:calendarId/item/single/:itemId', (req, res, next) => {
        calendarController.putItem(req, res, next)
    })

    //Recurrent
    router.post('/:calendarId/item/recurrent', (req, res, next) => {
        calendarController.postItemRecurrent(req, res, next)
    })

    router.delete('/:calendarId/item/recurrent/:itemId', (req, res, next) => {
        calendarController.deleteItemRecurrent(req, res, next)
    })

    router.put('/:calendarId/item/recurrent/:itemId', (req, res, next) => {
        calendarController.putItemRecurrent(req, res, next)
    })

    //Budget
    router.post('/:calendarId/budget', (req, res, next) => {
        calendarController.postBudget(req, res, next)
    })

    router.put('/:calendarId/budget/:budgetId', (req, res, next) => {
        calendarController.putBudget(req, res, next)
    })

    return router
}

module.exports = calendarWebApi