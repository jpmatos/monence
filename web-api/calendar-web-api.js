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

    /// Expenses
    router.post('/:calendarId/expense', (req, res, next) => {
        calendarController.postExpense(req, res, next)
    })

    router.delete('/:calendarId/expense/:expenseId', (req, res, next) => {
        calendarController.deleteExpense(req, res, next)
    })

    router.put('/:calendarId/expense/:expenseId', (req, res, next) => {
        calendarController.putExpense(req, res, next)
    })

    ///Gains
    router.post('/:calendarId/gain', (req, res, next) => {
        calendarController.postGain(req, res, next)
    })

    router.delete('/:calendarId/gain/:gainId', (req, res, next) => {
        calendarController.deleteGain(req, res, next)
    })

    router.put('/:calendarId/gain/:gainId', (req, res, next) => {
        calendarController.putGain(req, res, next)
    })

    return router
}

module.exports = calendarWebApi