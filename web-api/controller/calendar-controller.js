const calendarService = require('./../../service/calendar-service')

class CalendarController{
    static hello(req, res, next) {
        return Promise.resolve()
            .then(() => {
                res.status(200).json({message: 'Hello'})
            })
            .catch(next)
    }

    static getCalendar(req, res, next){
        const calendarId = req.params.calendarId
        return calendarService
            .getCalendar(calendarId)
            .then(calendar => res.status(200).json(calendar))
            .catch(next)
    }

    static postItem(req, res, next) {
        const calendarId = req.params.calendarId
        const item = req.body
        return calendarService
            .postItem(calendarId, item)
            .then(item => res.status(201).json(item))
            .catch(next)
    }

    static deleteItem(req, res, next) {
        const calendarId = req.params.calendarId
        const itemId = req.params.itemId
        return calendarService
            .deleteItem(calendarId, itemId)
            .then(msg => res.status(201).json(msg))
            .catch(next)
    }

    static putItem(req, res, next) {
        const calendarId = req.params.calendarId
        const itemId = req.params.itemId
        const item = req.body
        return calendarService
            .putItem(calendarId, itemId, item)
            .then(item => res.status(201).json(item))
            .catch(next)
    }
}

module.exports = CalendarController