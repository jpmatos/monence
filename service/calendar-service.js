const moment = require('moment')
const uuid = require('short-uuid')
const error = require('../object/error')
const roleCheck = require('./roles/roleCheck').init()
const uuidSchema = require('./joi-schemas/id-schemas').uuidSchema
const postItemSingleSchema = require('./joi-schemas/item-schemas').postItemSingleSchema
const postItemRecurrentSchema = require('./joi-schemas/item-schemas').postItemRecurrentSchema
const putItemSingleSchema = require('./joi-schemas/item-schemas').putItemSingleSchema
const putItemRecurrentSchema = require('./joi-schemas/item-schemas').putItemRecurrentSchema
const postBudgetSchema = require('./joi-schemas/budget-schemas').postBudgetSchema
const putBudgetSchema = require('./joi-schemas/budget-schemas').putBudgetSchema

class CalendarService {
    constructor(dbCalendar, dbUser, dbExchanges) {
        this.dbCalendar = dbCalendar
        this.dbUser = dbUser
        this.dbExchanges = dbExchanges
    }

    static init(dbCalendar, dbUser, dbExchanges) {
        return new CalendarService(dbCalendar, dbUser, dbExchanges)
    }

    getCalendar(calendarId, userId) {
        return Promise.all([this.dbCalendar.getCalendar(calendarId), this.dbExchanges.getExchanges()])
            .then(res => {
                const calendar = res[0]
                const exchanges = res[1]

                if (!roleCheck.isOwner(calendar, userId) && !roleCheck.canView(calendar, userId))
                    return Promise.reject(error(404, 'Calendar Not Found'))

                calendar.exchanges = exchanges

                return calendar
            })
    }

    getParticipants(userId, calendarId) {
        return this.dbCalendar.getCalendarOwnerAndParticipant(calendarId, userId)
            .then(calendar => {
                if (!calendar ||
                    (!roleCheck.isOwner(calendar, userId) && !roleCheck.canView(calendar, userId)))
                    return Promise.reject(error(404, 'Calendar Not Found'))

                return calendar.participants
            })
    }

    deleteParticipant(calendarId, participantId, userId) {
        return this.dbCalendar.getCalendarOwner(calendarId)
            .then(calendar => {
                if (!calendar ||
                    (!roleCheck.isOwner(calendar, userId) && !roleCheck.isSame(participantId, userId)))
                    return Promise.reject(error(404, 'Calendar Not Found'))

                return Promise.all([
                    this.dbCalendar.deleteParticipant(calendarId, participantId),
                    this.dbUser.deleteParticipating(participantId, calendarId)
                ])
            })
            .then(res => {
                return res[0]
            })
    }

    changeRole(calendarId, participantId, role, userId) {
        return this.dbCalendar.getCalendarOwner(calendarId)
            .then((calendar) => {
                if (!calendar ||
                    !roleCheck.isOwner(calendar, userId))
                    return Promise.reject(error(404, 'Calendar Not Found'))

                return this.dbCalendar.putRole(calendarId, participantId, role.role)
            })
    }

    //TODO Check this put
    putShare(calendarId, userId) {
        return this.dbCalendar.getCalendar(calendarId)
            .then(calendar => {
                if (!roleCheck.isOwner(calendar, userId))
                    return Promise.reject(error(404, 'Calendar Not Found'))

                calendar.share = 'Shared'
                calendar.participants = []

                return this.dbCalendar.putCalendar(calendarId, calendar)
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

        return this.dbCalendar.getCalendarOwnerAndParticipant(calendarId, userId)
            .then(calendar => {
                if (!calendar ||
                    (!roleCheck.isOwner(calendar, userId) && !roleCheck.isParticipating(calendar, userId)))
                    return Promise.reject(error(404, 'Calendar Not Found'))

                if(!roleCheck.isOwner(calendar, userId) && !roleCheck.canEdit(calendar, userId))
                    return Promise.reject(error(403, 'Insufficient permission'))

                item.recurrency = 'single'
                item.id = uuid.generate()

                return this.dbCalendar.postItemSingle(calendarId, item)
            })
            .then(calendar => {
                return calendar.single[0]
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

        return this.dbCalendar.getCalendarOwnerAndParticipant(calendarId, userId)
            .then(calendar => {
                if (!calendar ||
                    (!roleCheck.isOwner(calendar, userId) && !roleCheck.isParticipating(calendar, userId)))
                    return Promise.reject(error(404, 'Calendar Not Found'))

                if(!roleCheck.isOwner(calendar, userId) && !roleCheck.canEdit(calendar, userId))
                    return Promise.reject(error(403, 'Insufficient permission'))

                return this.dbCalendar.putItemSingle(calendarId, itemId, item)
            })
            .then(calendar => {
                return calendar.single[0]
            })
    }

    deleteItem(calendarId, itemId, userId) {
        if (uuidSchema.validate(calendarId).error)
            return Promise.reject(error(400, 'Invalid Calendar Id'))

        if (uuidSchema.validate(itemId).error)
            return Promise.reject(error(400, 'Invalid Item Id'))

        return this.dbCalendar.getCalendarOwnerAndParticipant(calendarId)
            .then(calendar => {
                if (!calendar ||
                    (!roleCheck.isOwner(calendar, userId) && !roleCheck.isParticipating(calendar, userId)))
                    return Promise.reject(error(404, 'Calendar Not Found'))

                if(!roleCheck.isOwner(calendar, userId) && !roleCheck.canEdit(calendar, userId))
                    return Promise.reject(error(403, 'Insufficient permission'))

                return this.dbCalendar.deleteItemSingle(calendarId, itemId, 'single')
            })
            .then(() => {
                return {'message': `Deleted item with id ${itemId}`}
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

        return this.dbCalendar.getCalendarOwnerAndParticipant(calendarId)
            .then(calendar => {
                if (!calendar ||
                    (!roleCheck.isOwner(calendar, userId) && !roleCheck.isParticipating(calendar, userId)))
                    return Promise.reject(error(404, 'Calendar Not Found'))

                if(!roleCheck.isOwner(calendar, userId) && !roleCheck.canEdit(calendar, userId))
                    return Promise.reject(error(403, 'Insufficient permission'))

                item.recurrency = 'recurrent'
                item.id = uuid.generate()

                return this.dbCalendar.postItemRecurrent(calendarId, item)
            })
            .then(calendar => {
                return calendar.recurrent[0]
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

        return this.dbCalendar.getCalendarOwnerAndParticipant(calendarId)
            .then(calendar => {
                if (!calendar ||
                    (!roleCheck.isOwner(calendar, userId) && !roleCheck.isParticipating(calendar, userId)))
                    return Promise.reject(error(404, 'Calendar Not Found'))

                if(!roleCheck.isOwner(calendar, userId) && !roleCheck.canEdit(calendar, userId))
                    return Promise.reject(error(403, 'Insufficient permission'))

                return this.dbCalendar.putItemRecurrent(calendarId, itemId, item, 'recurrent')
            })
            .then(calendar => {
                return calendar.recurrent[0]
            })
    }

    deleteItemRecurrent(calendarId, itemId, userId) {
        if (uuidSchema.validate(calendarId).error)
            return Promise.reject(error(400, 'Invalid Calendar Id'))

        if (uuidSchema.validate(itemId).error)
            return Promise.reject(error(400, 'Invalid Item Id'))

        return this.dbCalendar.getCalendarOwnerAndParticipant(calendarId)
            .then(calendar => {
                if (!calendar ||
                    (!roleCheck.isOwner(calendar, userId) && !roleCheck.isParticipating(calendar, userId)))
                    return Promise.reject(error(404, 'Calendar Not Found'))

                if(!roleCheck.isOwner(calendar, userId) && !roleCheck.canEdit(calendar, userId))
                    return Promise.reject(error(403, 'Insufficient permission'))

                return this.dbCalendar.deleteItemRecurrent(calendarId, itemId)
            })
            .then(() => {
                return {'message': `Deleted item with id ${itemId}`}
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

        return this.dbCalendar.getCalendarOwnerAndParticipant(calendarId)
            .then(calendar => {
                if (!calendar ||
                    (!roleCheck.isOwner(calendar, userId) && !roleCheck.isParticipating(calendar, userId)))
                    return Promise.reject(error(404, 'Calendar Not Found'))

                if(!roleCheck.isOwner(calendar, userId) && !roleCheck.canEdit(calendar, userId))
                    return Promise.reject(error(403, 'Insufficient permission'))

                budget.id = uuid.generate()

                return this.dbCalendar.postBudget(calendarId, budget)
            })
            .then(calendar => {
                return calendar.budget[0]
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

        return this.dbCalendar.getCalendarOwnerAndParticipant(calendarId)
            .then(calendar => {
                if (!calendar ||
                    (!roleCheck.isOwner(calendar, userId) && !roleCheck.isParticipating(calendar, userId)))
                    return Promise.reject(error(404, 'Calendar Not Found'))

                if(!roleCheck.isOwner(calendar, userId) && !roleCheck.canEdit(calendar, userId))
                    return Promise.reject(error(403, 'Insufficient permission'))

                return this.dbCalendar.putBudget(calendarId, budgetId, budget)
            })
            .then(calendar => {
                return calendar.budget[0]
            })
    }

    deleteBudget(calendarId, budgetId, userId) {
        if (uuidSchema.validate(calendarId).error)
            return Promise.reject(error(400, 'Invalid Calendar Id'))

        if (uuidSchema.validate(budgetId).error)
            return Promise.reject(error(400, 'Invalid Item Id'))

        return this.dbCalendar.getCalendarOwnerAndParticipant(calendarId)
            .then(calendar => {
                if (!calendar ||
                    (!roleCheck.isOwner(calendar, userId) && !roleCheck.isParticipating(calendar, userId)))
                    return Promise.reject(error(404, 'Calendar Not Found'))

                if(!roleCheck.isOwner(calendar, userId) && !roleCheck.canEdit(calendar, userId))
                    return Promise.reject(error(403, 'Insufficient permission'))

                return this.dbCalendar.deleteBudget(calendarId, budgetId)
            })
            .then(() => {
                return {'message': `Deleted item with id ${budgetId}`}
            })
    }
}

module.exports = CalendarService