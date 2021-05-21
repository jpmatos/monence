const moment = require('moment')
const db = require(Boolean(process.env.MOCK_DB === 'true') ? '../data/database-mock' : '../data/database-mongo')
const dbExchanges = require(process.env.MOCK_EXCHANGE_DB === 'true' ? '../data/database-exchanges-mock' : '../data/database-exchanges')

class CalendarService {

    static getCalendar(calendarId) {
        return Promise.all([db.getCalendar(calendarId), dbExchanges.getExchanges()])
            .then(res => {
                const calendar = res[0]
                const exchanges = res[1]
                calendar.exchanges = exchanges
                return calendar
            })
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

    static putBudget(calendarId, budgetId, budget) {
        budget.date = moment.utc(budget.date).startOf('day').toISOString()
        return db.putBudget(calendarId, budgetId, budget)
    }

    static deleteBudget(calendarId, budgetId) {
        return db.deleteBudget(calendarId, budgetId)
    }
}

module.exports = CalendarService