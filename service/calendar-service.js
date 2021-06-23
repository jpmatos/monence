const moment = require('moment')
const uuid = require('short-uuid')
const error = require('../object/error')
const roleCheck = require('./roles/roleCheck')
const idSchemas = require('./joi-schemas/id-schemas')
const itemSchemas = require('./joi-schemas/item-schemas')
const budgetSchemas = require('./joi-schemas/budget-schemas')

class CalendarService {
    constructor(dbCalendar, dbUser, dbExchanges, socketManager) {
        this.dbCalendar = dbCalendar
        this.dbUser = dbUser
        this.dbExchanges = dbExchanges
        this.socketManager = socketManager
    }

    static init(dbCalendar, dbUser, dbExchanges, socketManager) {
        return new CalendarService(dbCalendar, dbUser, dbExchanges, socketManager)
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

    deleteCalendar(calendarId, userId) {
        return this.dbCalendar.getCalendarOwner(calendarId)
            .then(calendar => {
                if (!calendar || !roleCheck.isOwner(calendar, userId))
                    return Promise.reject(error(404, 'Calendar Not Found'))

                return this.dbCalendar.getParticipants(calendarId)
            })
            .then(calendar => {
                const promises = []

                promises.push(this.dbCalendar.deleteCalendar(calendarId))
                promises.push(this.dbUser.deleteCalendar(userId, calendarId))

                calendar.participants.forEach(participant => {
                    promises.push(this.dbUser.deleteParticipating(participant.id, calendarId))
                })

                return Promise.all(promises)
            })
            .then(res => {
                const calendar = res[0]

                this.socketManager.toCalendarDeleted(calendarId, calendar.participants)
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
                if (calendar.participants.length === 0)
                    return Promise.reject(error(404, 'Participant Not Found'))

                return calendar.participants[0]
            })
            .then(participant => {
                if(participantId !== userId){
                    this.socketManager.toKickParticipant(calendarId, participant)
                }
                this.socketManager.toParticipantLeft(calendarId, userId, participant)
                return participant
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
                if (calendar.length === 0)
                    return Promise.reject(error(404, 'Participant Not Found'))

                return calendar.participants[0]
            })
            .then(participant => {
                this.socketManager.toChangeRole(calendarId, participant)
                return participant
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

    putUnshare(calendarId, userId) {
        return this.dbCalendar.getCalendar(calendarId)
            .then(calendar => {
                if (!roleCheck.isOwner(calendar, userId))
                    return Promise.reject(error(404, 'Calendar Not Found'))

                return this.dbCalendar.getParticipants(calendarId)
            })
            .then(calendar => {
                const promises = []

                promises.push(calendar.participants)
                promises.push(this.dbCalendar.putCalendarShare(calendarId, 'Personal'))
                calendar.participants.forEach(participant => {
                    promises.push(this.dbUser.deleteParticipating(participant.id, calendarId))
                })

                return Promise.all(promises)
            })
            .then(res => {
                const participants = res[0]
                const calendar = res[1]

                this.socketManager.toCalendarDeleted(calendarId, participants)

                return calendar
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

                if (!roleCheck.isOwner(calendar, userId) && !roleCheck.canEdit(calendar, userId))
                    return Promise.reject(error(403, 'Insufficient permission'))

                item.recurrency = 'single'
                item.id = uuid.generate()

                return this.dbCalendar.postItemSingle(calendarId, item)
            })
            .then(calendar => {
                if (calendar.single.length === 0)
                    return Promise.reject(error(500, 'Failed to add item'))

                return calendar.single[0]
            })
            .then(item => {
                this.socketManager.toNewItem(calendarId, userId, item)
                return item
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

                if (!roleCheck.isOwner(calendar, userId) && !roleCheck.canEdit(calendar, userId))
                    return Promise.reject(error(403, 'Insufficient permission'))

                return this.dbCalendar.putItemSingle(calendarId, itemId, item)
            })
            .then(calendar => {
                if (calendar.single.length === 0)
                    return Promise.reject(error(500, 'Failed to add item'))

                return calendar.single[0]
            })
            .then(item => {
                this.socketManager.toUpdateItem(calendarId, userId, item)
                return item
            })
    }

    deleteItem(calendarId, itemId, userId) {
        if (idSchemas.uuidSchema.validate(calendarId).error)
            return Promise.reject(error(400, 'Invalid Calendar Id'))

        if (idSchemas.uuidSchema.validate(itemId).error)
            return Promise.reject(error(400, 'Invalid Item Id'))

        return this.dbCalendar.getCalendarOwnerAndParticipant(calendarId, userId)
            .then(calendar => {
                if (!calendar ||
                    (!roleCheck.isOwner(calendar, userId) && !roleCheck.isParticipating(calendar, userId)))
                    return Promise.reject(error(404, 'Calendar Not Found'))

                if (!roleCheck.isOwner(calendar, userId) && !roleCheck.canEdit(calendar, userId))
                    return Promise.reject(error(403, 'Insufficient permission'))

                return this.dbCalendar.deleteItemSingle(calendarId, itemId, 'single')
            })
            .then(calendar => {
                if (calendar.single.length === 0)
                    return Promise.reject(error(500, 'Failed to delete item'))

                return calendar.single[0]
            })
            .then(item => {
                this.socketManager.toDeleteItem(calendarId, userId, item)
                return item
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

        return this.dbCalendar.getCalendarOwnerAndParticipant(calendarId, userId)
            .then(calendar => {
                if (!calendar ||
                    (!roleCheck.isOwner(calendar, userId) && !roleCheck.isParticipating(calendar, userId)))
                    return Promise.reject(error(404, 'Calendar Not Found'))

                if (!roleCheck.isOwner(calendar, userId) && !roleCheck.canEdit(calendar, userId))
                    return Promise.reject(error(403, 'Insufficient permission'))

                item.recurrency = 'recurrent'
                item.id = uuid.generate()

                return this.dbCalendar.postItemRecurrent(calendarId, item)
            })
            .then(calendar => {
                if (calendar.recurrent.length === 0)
                    return Promise.reject(error(500, 'Failed to add item'))

                return calendar.recurrent[0]
            })
            .then(item => {
                this.socketManager.toNewItem(calendarId, userId, item)
                return item
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

        return this.dbCalendar.getCalendarOwnerAndParticipant(calendarId, userId)
            .then(calendar => {
                if (!calendar ||
                    (!roleCheck.isOwner(calendar, userId) && !roleCheck.isParticipating(calendar, userId)))
                    return Promise.reject(error(404, 'Calendar Not Found'))

                if (!roleCheck.isOwner(calendar, userId) && !roleCheck.canEdit(calendar, userId))
                    return Promise.reject(error(403, 'Insufficient permission'))

                return this.dbCalendar.putItemRecurrent(calendarId, itemId, item, 'recurrent')
            })
            .then(calendar => {
                if (calendar.recurrent.length === 0)
                    return Promise.reject(error(500, 'Failed to update item'))

                return calendar.recurrent[0]
            })
            .then(item => {
                this.socketManager.toUpdateItem(calendarId, userId, item)
                return item
            })
    }

    deleteItemRecurrent(calendarId, itemId, userId) {
        if (idSchemas.uuidSchema.validate(calendarId).error)
            return Promise.reject(error(400, 'Invalid Calendar Id'))

        if (idSchemas.uuidSchema.validate(itemId).error)
            return Promise.reject(error(400, 'Invalid Item Id'))

        return this.dbCalendar.getCalendarOwnerAndParticipant(calendarId, userId)
            .then(calendar => {
                if (!calendar ||
                    (!roleCheck.isOwner(calendar, userId) && !roleCheck.isParticipating(calendar, userId)))
                    return Promise.reject(error(404, 'Calendar Not Found'))

                if (!roleCheck.isOwner(calendar, userId) && !roleCheck.canEdit(calendar, userId))
                    return Promise.reject(error(403, 'Insufficient permission'))

                return this.dbCalendar.deleteItemRecurrent(calendarId, itemId)
            })
            .then((calendar) => {
                if (calendar.recurrent.length === 0)
                    return Promise.reject(error(500, 'Failed to delete item'))

                return calendar.recurrent[0]
            })
            .then(item => {
                this.socketManager.toDeleteItem(calendarId, userId, item)
                return item
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

        return this.dbCalendar.getCalendarOwnerAndParticipant(calendarId, userId)
            .then(calendar => {
                if (!calendar ||
                    (!roleCheck.isOwner(calendar, userId) && !roleCheck.isParticipating(calendar, userId)))
                    return Promise.reject(error(404, 'Calendar Not Found'))

                if (!roleCheck.isOwner(calendar, userId) && !roleCheck.canEdit(calendar, userId))
                    return Promise.reject(error(403, 'Insufficient permission'))

                budget.id = uuid.generate()

                return this.dbCalendar.postBudget(calendarId, budget)
            })
            .then(calendar => {
                if (calendar.budget.length === 0)
                    return Promise.reject(error(500, 'Failed to add budget'))

                return calendar.budget[0]
            })
            .then(budget => {
                this.socketManager.toNewBudget(calendarId, userId, budget)
                return budget
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

        return this.dbCalendar.getCalendarOwnerAndParticipant(calendarId, userId)
            .then(calendar => {
                if (!calendar ||
                    (!roleCheck.isOwner(calendar, userId) && !roleCheck.isParticipating(calendar, userId)))
                    return Promise.reject(error(404, 'Calendar Not Found'))

                if (!roleCheck.isOwner(calendar, userId) && !roleCheck.canEdit(calendar, userId))
                    return Promise.reject(error(403, 'Insufficient permission'))

                return this.dbCalendar.putBudget(calendarId, budgetId, budget)
            })
            .then(calendar => {
                if (calendar.budget.length === 0)
                    return Promise.reject(error(500, 'Failed to update budget'))

                return calendar.budget[0]
            })
            .then(budget => {
                this.socketManager.toUpdateBudget(calendarId, userId, budget)
                return budget
            })
    }

    deleteBudget(calendarId, budgetId, userId) {
        if (idSchemas.uuidSchema.validate(calendarId).error)
            return Promise.reject(error(400, 'Invalid Calendar Id'))

        if (idSchemas.uuidSchema.validate(budgetId).error)
            return Promise.reject(error(400, 'Invalid Item Id'))

        return this.dbCalendar.getCalendarOwnerAndParticipant(calendarId, userId)
            .then(calendar => {
                if (!calendar ||
                    (!roleCheck.isOwner(calendar, userId) && !roleCheck.isParticipating(calendar, userId)))
                    return Promise.reject(error(404, 'Calendar Not Found'))

                if (!roleCheck.isOwner(calendar, userId) && !roleCheck.canEdit(calendar, userId))
                    return Promise.reject(error(403, 'Insufficient permission'))

                return this.dbCalendar.deleteBudget(calendarId, budgetId)
            })
            .then((calendar) => {
                if (calendar.budget.length === 0)
                    return Promise.reject(error(500, 'Failed to delete budget'))

                return calendar.budget[0]
            })
            .then(budget => {
                this.socketManager.toDeleteBudget(calendarId, userId, budget)
                return budget
            })
    }
}

module.exports = CalendarService