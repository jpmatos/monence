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

    router.delete('/:calendarId/item/:itemId', (req, res, next) => {
        calendarController.deleteItem(req, res, next)
    })

    router.put('/:calendarId/item/:itemId', (req, res, next) => {
        calendarController.putItem(req, res, next)
    })

    return router
}

// '/calendar/:calendarId/item/ -- não existe
// '/calendar/:calendarId/item/singular' -- post
// '/calendar/:calendarId/item/singular/:itemId' -- put/delete

// '/calendar/:calendarId/item/recurring/:itemId'

module.exports = calendarWebApi