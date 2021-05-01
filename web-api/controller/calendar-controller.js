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

    static postExpense(req, res, next) {
        const calendarId = req.params.calendarId
        const expense = req.body
        return calendarService
            .postExpense(calendarId, expense)
            .then(item => res.status(201).json(item))
            .catch(next)
    }

    static deleteExpense(req, res, next) {
        const calendarId = req.params.calendarId
        const expenseId = req.params.expenseId
        return calendarService
            .deleteExpense(calendarId, expenseId)
            .then(msg => res.status(201).json(msg))
            .catch(next)
    }

    static putExpense(req, res, next) {
        const calendarId = req.params.calendarId
        const expenseId = req.params.expenseId
        const expense = req.body
        return calendarService
            .putExpense(calendarId, expenseId, expense)
            .then(item => res.status(201).json(item))
            .catch(next)
    }
}

module.exports = CalendarController