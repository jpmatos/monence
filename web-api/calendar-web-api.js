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

    router.post('/:calendarId/expense', (req, res, next) => {
        calendarController.postExpense(req, res, next)
    })

    router.delete('/:calendarId/expense/:expenseId', (req, res, next) => {
        calendarController.deleteExpense(req, res, next)
    })

    router.put('/:calendarId/expense/:expenseId', (req, res, next) => {
        calendarController.putExpense(req, res, next)
    })

    return router
}

module.exports = calendarWebApi