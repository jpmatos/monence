const fs = require('fs').promises
const path = require('path')
const error = require('../object/error')

class DataBaseCalendarMock {
    constructor() {
        this.readFile(path.join(__dirname, '/mock-data/calendars.json'))
            .then(res => {
                this.calendars = res
            })
        this.readFile(path.join(__dirname, '/mock-data/users.json'))
            .then(res => {
                this.users = res
            })
    }

    static init() {
        return new DataBaseCalendarMock()
    }

    getCalendar(calendarId) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.reject(error(404, 'Calendar Not Found'))
        return Promise.resolve(this.calendars[calendarIdx])
    }

    putCalendar(calendarId, calendar) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.reject(`Calendar Not Found`)

        this.calendars[calendarIdx] = calendar

        return Promise.resolve(calendar)
    }

    postItem(calendarId, item, arrayName) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.reject(error(404, 'Calendar Not Found'))

        this.calendars[calendarIdx][arrayName].push(item)
        return Promise.resolve(item)
    }

    deleteItem(calendarId, itemId, arrayName) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve({'message': `Could not find calendar ${calendarId}`})

        this.calendars[calendarIdx][arrayName] = this.calendars[calendarIdx][arrayName].filter((item) => item.id !== itemId)

        return Promise.resolve({'message': `Deleted item with id ${itemId}`})
    }

    //TODO
    putItem(calendarId, itemId, item, arrayName) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve({'message': `Could not find calendar ${calendarId}`})

        const itemIdx = this.calendars[calendarIdx][arrayName].findIndex(i => i.id === itemId)
        const currItem = this.calendars[calendarIdx][arrayName][itemIdx]

        this.calendars[calendarIdx][arrayName][itemIdx] = {
            'id': currItem.id,
            'title': !item.title || item.title.length === 0 ? currItem.title : item.title,
            'recurrency': currItem.recurrency,
            'recurrencyPeriod': currItem.recurrencyPeriod,
            'type': currItem.type,
            'start': item.start,
            'end': item.end === null ? undefined : item.end,
            'value': !item.value || item.value === 0 ? currItem.value : item.value
        }

        return Promise.resolve(this.calendars[calendarIdx][arrayName][itemIdx])
    }

    postBudget(calendarId, budget) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve({'message': `Could not find calendar ${calendarId}`})

        this.calendars[calendarIdx].budget.push(budget)

        return Promise.resolve(budget)
    }

    //TODO
    putBudget(calendarId, budgetId, budget) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve({'message': `Could not find calendar ${calendarId}`})

        const budgetIdx = this.calendars[calendarIdx].budget.findIndex(i => i.id === budgetId)
        const currBudget = this.calendars[calendarIdx].budget[budgetIdx]

        this.calendars[calendarIdx].budget[budgetIdx] = {
            'id': currBudget.id,
            'date': budget.date,
            'value': budget.value,
            'period': currBudget.period
        }

        return Promise.resolve(this.calendars[calendarIdx].budget[budgetIdx])
    }

    deleteBudget(calendarId, budgetId) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve({'message': `Could not find calendar ${calendarId}`})

        this.calendars[calendarIdx].budget = this.calendars[calendarIdx].budget.filter((budget) => budget.id !== budgetId)

        return Promise.resolve({'message': `Deleted item with id ${budgetId}`})
    }

    postCalendar(userId, calendar) {
        this.calendars.push(calendar)

        return Promise.resolve(calendar)
    }

    //Invites
    getCalendarInvites(calendarId) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve({'message': `Could not find calendar ${calendarId}`})

        const invites = this.calendars[calendarIdx].invites
        const invitees = this.calendars[calendarIdx].invitees

        return Promise.resolve({
            'invites': invites,
            'invitees': invitees
        })
    }

    postInviteToCalendar(calendarId, invite) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve({'message': `Could not find calendar ${calendarId}`})

        this.calendars[calendarIdx].invites.push(invite)

        return Promise.resolve(invite)
    }

    deleteCalendarInvite(inviteId, calendarId) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve({'message': `Could not find calendar ${calendarId}`})

        this.calendars[calendarIdx].invites = this.calendars[calendarIdx].invites.filter(inv => inv.id !== inviteId)

        return Promise.resolve({'message': 'Deleted invite'})
    }
    postCalendarInvitee(inviteId, calendarId, invitee) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve({'message': `Could not find calendar ${calendarId}`})

        this.calendars[calendarIdx].invitees.push(invitee)

        const accept = {
            "id": this.calendars[calendarIdx].id,
            "name": this.calendars[calendarIdx].name
        }

        //TODO Should this be returned?
        return Promise.resolve(accept)
    }

    deleteUserFromCalendar(calendarId, userId) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve({'message': `Could not find calendar ${calendarId}`})

        this.calendars[calendarIdx].invitees = this.calendars[calendarIdx].invitees.filter(inv => inv.id !== userId)

        return Promise.resolve({'message': 'Deleted user from calendar'})
    }

    readFile(filePath) {
        return fs
            .readFile(filePath)
            .then(rawData => {
                return JSON.parse(rawData)
            })
            .catch(err => {
                return {
                    'message': `Could not find mock file in path ${filePath}`,
                    'status': 404,
                    'err': err
                }
            })
    }
}

module.exports = DataBaseCalendarMock