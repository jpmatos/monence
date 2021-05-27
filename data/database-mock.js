const fs = require('fs').promises
const path = require('path')
const uuid = require('short-uuid')
const error = require('../object/error')

class DatabaseMock {
    constructor() {
        this.readFile(path.join(__dirname, '/mock/calendars.json'))
            .then(res => {
                this.calendars = res
            })
        this.readFile(path.join(__dirname, '/mock/users.json'))
            .then(res => {
                this.users = res
            })
    }

    static init() {
        return new DatabaseMock()
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

    verifyNewUser(user) {
        const userIdx = this.users.findIndex(usr => usr.id === user.id)
        if (userIdx === -1) {
            this.users.push(user)
            return Promise.resolve('Created new user')
        }
        return Promise.resolve('User already exists')
    }


    //Users Index

    getUser(userId) {
        const userIdx = this.users.findIndex(user => user.id === userId)
        if (userIdx === -1)
            return Promise.resolve({'message': `Could not find user ${userIdx}`})

        return Promise.resolve(this.users[userIdx])
    }

    postCalendar(userId, calendar) {
        const userIdx = this.users.findIndex(user => user.id === userId)
        if (userIdx === -1)
            return Promise.resolve({'message': `Could not find user ${userIdx}`})

        calendar.id = uuid.generate()

        this.users[userIdx].calendars.push(calendar)
        this.calendars.push({
            "name": calendar.name,
            "ownerId": calendar.ownerId,
            "id": calendar.id,
            "currency": calendar.currency,
            "single": [],
            "recurrent": [],
            "budget": []
        })

        return Promise.resolve(calendar)
    }

    getUserByEmail(email) {
        const userIdx = this.users.findIndex(user => user.email === email)
        if (userIdx === -1)
            return Promise.resolve({'error': `Could not find user ${email}`})

        return this.users[userIdx]
    }

    //Invites

    postInvite(calendarId, invite, userId, userInvite) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve({'message': `Could not find calendar ${calendarId}`})


        const userIdx = this.users.findIndex(user => user.id === userId)
        if (userIdx === -1)
            return Promise.resolve({'message': `Could not find user ${userIdx}`})

        this.calendars[calendarIdx].invites.push(invite)
        this.users[userIdx].invites.push(userInvite)

        return Promise.resolve(invite)
    }

    deleteInvite(calendarId, inviteId, email) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve({'message': `Could not find calendar ${calendarId}`})

        this.calendars[calendarIdx].invites = this.calendars[calendarIdx].invites.filter(inv => inv.id !== inviteId)

        const userIdx = this.users.findIndex(user => user.email === email)
        if (userIdx !== -1)
            this.users[userIdx].invites = this.users[userIdx].invites.filter(inv => inv.id !== inviteId)

        return Promise.resolve({'message': 'Deleted invite'})
    }

    deleteUserInvite(userId, inviteId) {
        const userIdx = this.users.findIndex(user => user.id === userId)
        if (userIdx === -1)
            return Promise.resolve({'message': `Could not find user ${userIdx}`})

        const invite = this.users[userIdx].invites.find(inv => inv.id === inviteId)

        this.users[userIdx].invites = this.users[userIdx].invites.filter(inv => inv.id !== inviteId)

        return Promise.resolve(invite)
    }

    acceptCalendarInvite(inviteId, calendarId, invitee) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve({'message': `Could not find calendar ${calendarId}`})

        this.calendars[calendarIdx].invites = this.calendars[calendarIdx].invites.filter(inv => inv.id !== inviteId)

        this.calendars[calendarIdx].invitees.push(invitee)

        const accept = {
            "id": this.calendars[calendarIdx].id,
            "name": this.calendars[calendarIdx].name
        }

        return Promise.resolve(accept)
    }

    postUserInvitedCalendar(userId, accept) {
        const userIdx = this.users.findIndex(user => user.id === userId)
        if (userIdx === -1)
            return Promise.resolve({'message': `Could not find user ${userIdx}`})

        this.users[userIdx].invitedCalendars.push(accept)

        return Promise.resolve(accept)
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

module.exports = DatabaseMock