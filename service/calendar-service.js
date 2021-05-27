const moment = require('moment')
const uuid = require('short-uuid')
const error = require('../object/error')
const uuidSchema = require('./joi-schemas/id-schemas').uuidSchema
const postItemSingleSchema = require('./joi-schemas/item-schemas').postItemSingleSchema
const postItemRecurrentSchema = require('./joi-schemas/item-schemas').postItemRecurrentSchema
const putItemSingleSchema = require('./joi-schemas/item-schemas').putItemSingleSchema
const putItemRecurrentSchema = require('./joi-schemas/item-schemas').putItemRecurrentSchema
const postBudgetSchema = require('./joi-schemas/budget-schemas').postBudgetSchema
const putBudgetSchema = require('./joi-schemas/budget-schemas').putBudgetSchema

class CalendarService {
    constructor(db, dbExchanges) {
        this.db = db
        this.dbExchanges = dbExchanges
    }

    static init(db, dbExchanges){
        return new CalendarService(db, dbExchanges)
    }

    getCalendar(calendarId, userId) {
        return Promise.all([this.db.getCalendar(calendarId), this.dbExchanges.getExchanges()])
            .then(res => {
                const calendar = res[0]
                if (calendar.ownerId !== userId && (calendar.invitees.find(invitee => invitee.id === userId) === undefined))
                    return Promise.reject(error(404, 'Calendar Not Found'))

                const exchanges = res[1]
                calendar.exchanges = exchanges
                return calendar
            })
    }

    putShare(calendarId, userId){
        return this.db.getCalendar(calendarId)
            .then(calendar => {
                if (calendar.ownerId !== userId)
                    return Promise.reject(error(404, 'Calendar Not Found'))

                calendar.share = 'Shared'
                calendar.invites = []
                calendar.invitees = []

                return this.db.putCalendar(calendarId, calendar)
            })
    }

    postItem(calendarId, item, userId) {
        if (uuidSchema.validate(calendarId).error)
            return Promise.reject(error(400, 'Invalid Calendar Id'))

        if (item.start !== undefined)
            item.start = moment.utc(item.start).startOf('day').toISOString()

        const result = postItemSingleSchema.validate(item, {stripUnknown: true})
        if (result.error)
            return Promise.reject(error(400, result.error.details[0].message))
        item = Object.assign({}, result.value)

        return this.db.getCalendar(calendarId)
            .then(calendar => {
                if (calendar.ownerId !== userId)
                    return Promise.reject(error(404, 'Calendar Not Found'))

                item.recurrency = 'single'
                item.id = uuid.generate()

                return this.db.postItem(calendarId, item, 'single')
            })
    }

    putItem(calendarId, itemId, item, userId) {
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

        return this.db.getCalendar(calendarId)
            .then(calendar => {
                if (calendar.ownerId !== userId)
                    return Promise.reject(error(404, 'Calendar Not Found'))

                return this.db.putItem(calendarId, itemId, item, 'single')
            })
    }

    deleteItem(calendarId, itemId, userId) {
        if (uuidSchema.validate(calendarId).error)
            return Promise.reject(error(400, 'Invalid Calendar Id'))

        if (uuidSchema.validate(itemId).error)
            return Promise.reject(error(400, 'Invalid Item Id'))

        return this.db.getCalendar(calendarId)
            .then(calendar => {
                if (calendar.ownerId !== userId)
                    return Promise.reject(error(404, 'Calendar Not Found'))

                return this.db.deleteItem(calendarId, itemId, 'single')
            })
    }

    postItemRecurrent(calendarId, item, userId) {
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

        return this.db.getCalendar(calendarId)
            .then(calendar => {
                if (calendar.ownerId !== userId)
                    return Promise.reject(error(404, 'Calendar Not Found'))

                item.recurrency = 'recurrent'
                item.id = uuid.generate()

                return this.db.postItem(calendarId, item, 'recurrent')
            })
    }

    putItemRecurrent(calendarId, itemId, item, userId) {
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

        return this.db.getCalendar(calendarId)
            .then(calendar => {
                if (calendar.ownerId !== userId)
                    return Promise.reject(error(404, 'Calendar Not Found'))

                return this.db.putItem(calendarId, itemId, item, 'recurrent')
            })
    }

    deleteItemRecurrent(calendarId, itemId, userId) {
        if (uuidSchema.validate(calendarId).error)
            return Promise.reject(error(400, 'Invalid Calendar Id'))

        if (uuidSchema.validate(itemId).error)
            return Promise.reject(error(400, 'Invalid Item Id'))

        return this.db.getCalendar(calendarId)
            .then(calendar => {
                if (calendar.ownerId !== userId)
                    return Promise.reject(error(404, 'Calendar Not Found'))

                return this.db.deleteItem(calendarId, itemId, 'recurrent')
            })
    }

    //Budget
    postBudget(calendarId, budget, userId) {
        if (uuidSchema.validate(calendarId).error)
            return Promise.reject(error(400, 'Invalid Calendar Id'))

        if (budget.date !== undefined)
            budget.date = moment.utc(budget.date).startOf('day').toISOString()

        const result = postBudgetSchema.validate(budget, {stripUnknown: true})
        if (result.error)
            return Promise.reject(error(400, result.error.details[0].message))
        budget = Object.assign({}, result.value)

        return this.db.getCalendar(calendarId)
            .then(calendar => {
                if (calendar.ownerId !== userId)
                    return Promise.reject(error(404, 'Calendar Not Found'))

                budget.id = uuid.generate()

                return this.db.postBudget(calendarId, budget)
            })
    }

    putBudget(calendarId, budgetId, budget, userId) {
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

        return this.db.getCalendar(calendarId)
            .then(calendar => {
                if (calendar.ownerId !== userId)
                    return Promise.reject(error(404, 'Calendar Not Found'))

                return this.db.putBudget(calendarId, budgetId, budget)
            })
    }

    deleteBudget(calendarId, budgetId, userId) {
        if (uuidSchema.validate(calendarId).error)
            return Promise.reject(error(400, 'Invalid Calendar Id'))

        if (uuidSchema.validate(budgetId).error)
            return Promise.reject(error(400, 'Invalid Item Id'))

        return this.db.getCalendar(calendarId)
            .then(calendar => {
                if (calendar.ownerId !== userId)
                    return Promise.reject(error(404, 'Calendar Not Found'))

                return this.db.deleteBudget(calendarId, budgetId)
            })
    }

    //Invites
    getInvites(calendarId, userId) {
        return this.db.getCalendarInvites(calendarId)
            .then(invites => {
                return invites
            })
    }

    postInvite(calendarId, invite, username, userId) {
        return Promise.all([this.db.getUserByEmail(invite.email), this.db.getCalendar(calendarId)])
            .then(res => {
                const user = res[0]
                const calendar = res[1]

                if(user.error !== undefined)
                    return Promise.reject(error(404, 'Could Not Find User'))

                if (calendar.ownerId !== userId)
                    return Promise.reject(error(404, 'Calendar Not Found'))

                if(user.invites.findIndex(inv => inv.calendarId === calendarId) !== -1)
                    return Promise.reject(error(400, 'User Already Invited!'))

                const id = uuid.generate()

                const userInvite = {
                    id: id,
                    calendarId: calendarId,
                    inviter: username,
                    calendarName: calendar.name
                }

                invite.id = id

                return this.db.postInvite(calendarId, invite, user.id, userInvite)
            })
    }

    deleteInvite(calendarId, inviteId, userId) {
        return this.db.getCalendar(calendarId)
            .then(calendar => {
                if (calendar.ownerId !== userId)
                    return Promise.reject(error(404, 'Calendar Not Found'))

                const email = calendar.invites.find(inv => inv.id === inviteId).email

                return this.db.deleteInvite(calendarId, inviteId, email)
            })
    }
}

module.exports = CalendarService