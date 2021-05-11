const moment = require('moment')
const db = require('../data/database-mock')

class CalendarService {

    static getCalendar(calendarId) {
        return db.getCalendar(calendarId)
    }

    static postItem(calendarId, item) {
        item.start = moment.utc(item.start).startOf('day').toISOString()
        return db.postItem(calendarId, item, 'single')
    }

    static deleteItem(calendarId, itemId) {
        return db.deleteItem(calendarId, itemId, 'single')
    }

    static putItem(calendarId, itemId, item) {
        if (item.start !== undefined)
            item.start = moment.utc(item.start).startOf('day').toISOString()
        return db.putItem(calendarId, itemId, item, 'single')
    }

    static postItemRecurrent(calendarId, item) {
        item.start = moment.utc(item.start).startOf('day').toISOString()
        item.end = moment.utc(item.end).startOf('day').toISOString()
        return db.postItem(calendarId, item, 'recurrent')
    }

    static deleteItemRecurrent(calendarId, itemId) {
        return db.deleteItem(calendarId, itemId, 'recurrent')
    }

    static putItemRecurrent(calendarId, itemId, item) {
        if (item.start !== undefined)
            item.start = moment.utc(item.start).startOf('day').toISOString()
        if (item.end !== undefined)
            item.end = moment.utc(item.end).startOf('day').toISOString()
        return db.putItem(calendarId, itemId, item, 'recurrent')
    }

    static postBudget(calendarId, budget) {
        budget.date = moment.utc(budget.date).startOf('day').toISOString()
        return db.postBudget(calendarId, budget)
    }
}

module.exports = CalendarService