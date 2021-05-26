const moment = require('moment')
const uuid = require('short-uuid')
const db = require(Boolean(process.env.MOCK_DB === 'true') ? '../data/database-mock' : '../data/database-mongo')
const dbExchanges = require(process.env.MOCK_EXCHANGE_DB === 'true' ? '../data/database-exchanges-mock' : '../data/database-exchanges')
const error = require('../object/error')
const uuidSchema = require('./joi-schemas/id-schemas').uuidSchema
const postItemSingleSchema = require('./joi-schemas/item-schemas').postItemSingleSchema
const postItemRecurrentSchema = require('./joi-schemas/item-schemas').postItemRecurrentSchema
const putItemSingleSchema = require('./joi-schemas/item-schemas').putItemSingleSchema
const putItemRecurrentSchema = require('./joi-schemas/item-schemas').putItemRecurrentSchema
const postBudgetSchema = require('./joi-schemas/budget-schemas').postBudgetSchema
const putBudgetSchema = require('./joi-schemas/budget-schemas').putBudgetSchema

class CalendarService {

    static getCalendar(calendarId, userId) {
        return Promise.all([db.getCalendar(calendarId), dbExchanges.getExchanges()])
            .then(res => {
                const calendar = res[0]
                if (calendar.ownerId !== userId)
                    return Promise.reject(error(404, 'Calendar Not Found'))

                const exchanges = res[1]
                calendar.exchanges = exchanges
                return calendar
            })
    }

    static putShare(calendarId, userId){
        return db.getCalendar(calendarId)
            .then(calendar => {
                if (calendar.ownerId !== userId)
                    return Promise.reject(error(404, 'Calendar Not Found'))

                calendar.share = 'Shared'
                calendar.invites = []
                calendar.invitees = []

                return db.putCalendar(calendarId, calendar)
            })
    }

    static postItem(calendarId, item, userId) {
        if (uuidSchema.validate(calendarId).error)
            return Promise.reject(error(400, 'Invalid Calendar Id'))

        if (item.start !== undefined)
            item.start = moment.utc(item.start).startOf('day').toISOString()

        const result = postItemSingleSchema.validate(item, {stripUnknown: true})
        if (result.error)
            return Promise.reject(error(400, result.error.details[0].message))
        item = Object.assign({}, result.value)

        return db.getCalendar(calendarId)
            .then(calendar => {
                if (calendar.ownerId !== userId)
                    return Promise.reject(error(404, 'Calendar Not Found'))

                item.recurrency = 'single'
                item.id = uuid.generate()

                return db.postItem(calendarId, item, 'single')
            })
    }

    static putItem(calendarId, itemId, item, userId) {
        if (uuidSchema.validate(calendarId).error)
            return Promise.reject(error(400, 'Invalid Calendar Id'))

        if (uuidSchema.validate(itemId).error)
            return Promise.reject(error(400, 'Invalid Item Id'))

        if (Object.keys(item).length === 0)
            return Promise.reject(error(400, 'Item Is Empty'))

        if (item.start !== undefined)
            item.start = moment.utc(item.start).startOf('day').toISOString()

        const result = putItemSingleSchema.validate(item, {stripUnknown: true})
        if (result.error)
            return Promise.reject(error(400, result.error.details[0].message))
        item = Object.assign({}, result.value)

        return db.getCalendar(calendarId)
            .then(calendar => {
                if (calendar.ownerId !== userId)
                    return Promise.reject(error(404, 'Calendar Not Found'))

                return db.putItem(calendarId, itemId, item, 'single')
            })
    }

    static deleteItem(calendarId, itemId, userId) {
        if (uuidSchema.validate(calendarId).error)
            return Promise.reject(error(400, 'Invalid Calendar Id'))

        if (uuidSchema.validate(itemId).error)
            return Promise.reject(error(400, 'Invalid Item Id'))

        return db.getCalendar(calendarId)
            .then(calendar => {
                if (calendar.ownerId !== userId)
                    return Promise.reject(error(404, 'Calendar Not Found'))

                return db.deleteItem(calendarId, itemId, 'single')
            })
    }

    static postItemRecurrent(calendarId, item, userId) {
        if (uuidSchema.validate(calendarId).error)
            return Promise.reject(error(400, 'Invalid Calendar Id'))

        if (item.start !== undefined)
            item.start = moment.utc(item.start).startOf('day').toISOString()

        if (item.end !== undefined)
            item.end = moment.utc(item.end).startOf('day').toISOString()

        const result = postItemRecurrentSchema.validate(item, {stripUnknown: true})
        if (result.error)
            return Promise.reject(error(400, result.error.details[0].message))
        item = Object.assign({}, result.value)

        return db.getCalendar(calendarId)
            .then(calendar => {
                if (calendar.ownerId !== userId)
                    return Promise.reject(error(404, 'Calendar Not Found'))

                item.recurrency = 'recurrent'
                item.id = uuid.generate()

                return db.postItem(calendarId, item, 'recurrent')
            })
    }

    static putItemRecurrent(calendarId, itemId, item, userId) {
        if (uuidSchema.validate(calendarId).error)
            return Promise.reject(error(400, 'Invalid Calendar Id'))

        if (uuidSchema.validate(itemId).error)
            return Promise.reject(error(400, 'Invalid Item Id'))

        if (Object.keys(item).length === 0)
            return Promise.reject(error(400, 'Item Is Empty'))

        if (item.start !== undefined)
            item.start = moment.utc(item.start).startOf('day').toISOString()
        if (item.end !== undefined)
            item.end = moment.utc(item.end).startOf('day').toISOString()

        const result = putItemRecurrentSchema.validate(item, {stripUnknown: true})
        if (result.error)
            return Promise.reject(error(400, result.error.details[0].message))
        item = Object.assign({}, result.value)

        return db.getCalendar(calendarId)
            .then(calendar => {
                if (calendar.ownerId !== userId)
                    return Promise.reject(error(404, 'Calendar Not Found'))

                return db.putItem(calendarId, itemId, item, 'recurrent')
            })
    }

    static deleteItemRecurrent(calendarId, itemId, userId) {
        if (uuidSchema.validate(calendarId).error)
            return Promise.reject(error(400, 'Invalid Calendar Id'))

        if (uuidSchema.validate(itemId).error)
            return Promise.reject(error(400, 'Invalid Item Id'))

        return db.getCalendar(calendarId)
            .then(calendar => {
                if (calendar.ownerId !== userId)
                    return Promise.reject(error(404, 'Calendar Not Found'))

                return db.deleteItem(calendarId, itemId, 'recurrent')
            })
    }

    //Budget
    static postBudget(calendarId, budget, userId) {
        if (uuidSchema.validate(calendarId).error)
            return Promise.reject(error(400, 'Invalid Calendar Id'))

        if (budget.date !== undefined)
            budget.date = moment.utc(budget.date).startOf('day').toISOString()

        const result = postBudgetSchema.validate(budget, {stripUnknown: true})
        if (result.error)
            return Promise.reject(error(400, result.error.details[0].message))
        budget = Object.assign({}, result.value)

        return db.getCalendar(calendarId)
            .then(calendar => {
                if (calendar.ownerId !== userId)
                    return Promise.reject(error(404, 'Calendar Not Found'))

                budget.id = uuid.generate()

                return db.postBudget(calendarId, budget)
            })
    }

    static putBudget(calendarId, budgetId, budget, userId) {
        if (uuidSchema.validate(calendarId).error)
            return Promise.reject(error(400, 'Invalid Calendar Id'))

        if (uuidSchema.validate(budgetId).error)
            return Promise.reject(error(400, 'Invalid Item Id'))

        if (Object.keys(budget).length === 0)
            return Promise.reject(error(400, 'Item Is Empty'))

        if (budget.date !== undefined)
            budget.date = moment.utc(budget.date).startOf('day').toISOString()

        const result = putBudgetSchema.validate(budget, {stripUnknown: true})
        if (result.error)
            return Promise.reject(error(400, result.error.details[0].message))
        budget = Object.assign({}, result.value)

        return db.getCalendar(calendarId)
            .then(calendar => {
                if (calendar.ownerId !== userId)
                    return Promise.reject(error(404, 'Calendar Not Found'))

                return db.putBudget(calendarId, budgetId, budget)
            })
    }

    static deleteBudget(calendarId, budgetId, userId) {
        if (uuidSchema.validate(calendarId).error)
            return Promise.reject(error(400, 'Invalid Calendar Id'))

        if (uuidSchema.validate(budgetId).error)
            return Promise.reject(error(400, 'Invalid Item Id'))

        return db.getCalendar(calendarId)
            .then(calendar => {
                if (calendar.ownerId !== userId)
                    return Promise.reject(error(404, 'Calendar Not Found'))

                return db.deleteBudget(calendarId, budgetId)
            })
    }

    //Invites
    static postInvite(calendarId, invite, userId) {
        return Promise.all([db.getUserByEmail(invite.email), db.getCalendar(calendarId)])
            .then(res => {
                const user = res[0]
                const calendar = res[1]

                if(user.error !== undefined)
                    return Promise.reject(error(404, 'Could Not Find User'))

                if (calendar.ownerId !== userId)
                    return Promise.reject(error(404, 'Calendar Not Found'))

                if(user.invites.findIndex(inv => inv.calendarId === calendarId) !== -1)
                    return Promise.reject(error(400, 'User Already Invited!'))

                const userInvite = {
                    calendarId: calendarId,
                    calendarName: calendar.name
                }

                return Promise.all([db.putUserInvite(user.id, userInvite), db.putCalendarInvite(calendarId, invite)])
            })
            .then(res => {
                return res[1]
            })
    }
}

module.exports = CalendarService