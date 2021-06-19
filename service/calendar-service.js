const moment = require('moment')
const uuid = require('short-uuid')
const error = require('../object/error')
const roleCheck = require('./roles/roleCheck')
const idSchemas = require('./joi-schemas/id-schemas')
const itemSchemas = require('./joi-schemas/item-schemas')
const budgetSchemas = require('./joi-schemas/budget-schemas')

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
        return Promise.all([
            this.dbCalendar.getCalendar(calendarId),
            this.dbExchanges.getExchanges()
        ])
            .then(res => {
                const calendar = res[0]
                const exchanges = res[1]

                if (!calendar ||
                    (!roleCheck.isOwner(calendar, userId) && !roleCheck.canView(calendar, userId)))
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

                return this.dbCalendar.getParticipants(calendarId)
            })
            .then(calendar => {
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
                const calendar = res[0]
                if(calendar.participants.length === 0)
                    return Promise.reject(error(404, 'Participant Not Found'))

                return calendar.participants[0]
            })
    }

    changeRole(calendarId, participantId, role, userId) {
        return this.dbCalendar.getCalendarOwner(calendarId)
            .then(calendar => {
                if (!calendar ||
                    !roleCheck.isOwner(calendar, userId))
                    return Promise.reject(error(404, 'Calendar Not Found'))

                return this.dbCalendar.putRole(calendarId, participantId, role.role)
            })
            .then(calendar => {
                if(calendar.length === 0)
                    return Promise.reject(error(404, 'Participant Not Found'))

                return calendar.participants[0]
            })
    }

    putShare(calendarId, userId) {
        return this.dbCalendar.getCalendar(calendarId)
            .then(calendar => {
                if (!roleCheck.isOwner(calendar, userId))
                    return Promise.reject(error(404, 'Calendar Not Found'))

                return this.dbCalendar.putCalendarShare(calendarId, 'Shared')
            })
    }

    postItem(calendarId, item, userId) {
        if (idSchemas.uuidSchema.validate(calendarId).error)
            return Promise.reject(error(400, 'Invalid Calendar Id'))

        if (item.start !== undefined)
            item.start = moment.utc(item.start).startOf('day').toISOString()

        const result = itemSchemas.postItemSingleSchema.validate(item, {stripUnknown: true})
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
                if(calendar.single.length === 0)
                    return Promise.reject(error(500, 'Failed to add item'))

                return calendar.single[0]
            })
    }

    putItem(calendarId, itemId, item, userId) {
        if (idSchemas.uuidSchema.validate(calendarId).error)
            return Promise.reject(error(400, 'Invalid Calendar Id'))

        if (idSchemas.uuidSchema.validate(itemId).error)
            return Promise.reject(error(400, 'Invalid Item Id'))

        if (Object.keys(item).length === 0)
            return Promise.reject(error(400, 'Item Is Empty'))

        if (item.start !== undefined)
            item.start = moment.utc(item.start).startOf('day').toISOString()

        const result = itemSchemas.putItemSingleSchema.validate(item, {stripUnknown: true})
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
                if(calendar.single.length === 0)
                    return Promise.reject(error(500, 'Failed to add item'))

                return calendar.single[0]
            })
    }

    deleteItem(calendarId, itemId, userId) {
        if (idSchemas.uuidSchema.validate(calendarId).error)
            return Promise.reject(error(400, 'Invalid Calendar Id'))

        if (idSchemas.uuidSchema.validate(itemId).error)
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
            .then((calendar) => {
                if(calendar.single.length === 0)
                    return Promise.reject(error(500, 'Failed to delete item'))

                return calendar.single[0]
            })
    }

    postItemRecurrent(calendarId, item, userId) {
        if (idSchemas.uuidSchema.validate(calendarId).error)
            return Promise.reject(error(400, 'Invalid Calendar Id'))

        if (item.start !== undefined)
            item.start = moment.utc(item.start).startOf('day').toISOString()

        if (item.end !== undefined)
            item.end = moment.utc(item.end).startOf('day').toISOString()

        const result = itemSchemas.postItemRecurrentSchema.validate(item, {stripUnknown: true})
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
                if(calendar.recurrent.length === 0)
                    return Promise.reject(error(500, 'Failed to add item'))

                return calendar.recurrent[0]
            })
    }

    putItemRecurrent(calendarId, itemId, item, userId) {
        if (idSchemas.uuidSchema.validate(calendarId).error)
            return Promise.reject(error(400, 'Invalid Calendar Id'))

        if (idSchemas.uuidSchema.validate(itemId).error)
            return Promise.reject(error(400, 'Invalid Item Id'))

        if (Object.keys(item).length === 0)
            return Promise.reject(error(400, 'Item Is Empty'))

        if (item.start !== undefined)
            item.start = moment.utc(item.start).startOf('day').toISOString()
        if (item.end !== undefined)
            item.end = moment.utc(item.end).startOf('day').toISOString()

        const result = itemSchemas.putItemRecurrentSchema.validate(item, {stripUnknown: true})
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
                if(calendar.recurrent.length === 0)
                    return Promise.reject(error(500, 'Failed to update item'))

                return calendar.recurrent[0]
            })
    }

    deleteItemRecurrent(calendarId, itemId, userId) {
        if (idSchemas.uuidSchema.validate(calendarId).error)
            return Promise.reject(error(400, 'Invalid Calendar Id'))

        if (idSchemas.uuidSchema.validate(itemId).error)
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
            .then((calendar) => {
                if(calendar.recurrent.length === 0)
                    return Promise.reject(error(500, 'Failed to delete item'))

                return calendar.recurrent[0]
            })
    }

    //Budget
    postBudget(calendarId, budget, userId) {
        if (idSchemas.uuidSchema.validate(calendarId).error)
            return Promise.reject(error(400, 'Invalid Calendar Id'))

        if (budget.date !== undefined)
            budget.date = moment.utc(budget.date).startOf('day').toISOString()

        const result = budgetSchemas.postBudgetSchema.validate(budget, {stripUnknown: true})
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
                if(calendar.budget.length === 0)
                    return Promise.reject(error(500, 'Failed to add budget'))

                return calendar.budget[0]
            })
    }

    putBudget(calendarId, budgetId, budget, userId) {
        if (idSchemas.uuidSchema.validate(calendarId).error)
            return Promise.reject(error(400, 'Invalid Calendar Id'))

        if (idSchemas.uuidSchema.validate(budgetId).error)
            return Promise.reject(error(400, 'Invalid Item Id'))

        if (Object.keys(budget).length === 0)
            return Promise.reject(error(400, 'Item Is Empty'))

        if (budget.date !== undefined)
            budget.date = moment.utc(budget.date).startOf('day').toISOString()

        const result = budgetSchemas.putBudgetSchema.validate(budget, {stripUnknown: true})
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
                if(calendar.budget.length === 0)
                    return Promise.reject(error(500, 'Failed to update budget'))

                return calendar.budget[0]
            })
    }

    deleteBudget(calendarId, budgetId, userId) {
        if (idSchemas.uuidSchema.validate(calendarId).error)
            return Promise.reject(error(400, 'Invalid Calendar Id'))

        if (idSchemas.uuidSchema.validate(budgetId).error)
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
            .then((calendar) => {
                if(calendar.budget.length === 0)
                    return Promise.reject(error(500, 'Failed to delete budget'))

                return calendar.budget[0]
            })
    }
}

module.exports = CalendarService