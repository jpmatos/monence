const express = require('express');
const router = express.Router();
const calendarController = require('./controller/calendar-controller')

function calendarWebApi(){
    /* GET home page. */
    router.get('/hello', (req, res, next) => {
        calendarController.hello(req, res, next)
    })

    return router
}

module.exports = calendarWebApi