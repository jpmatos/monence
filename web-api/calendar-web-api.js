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

    router.post('/:calendarId/item', (req, res, next) => {
        calendarController.postItem(req, res, next)
    })

    return router
}

module.exports = calendarWebApi