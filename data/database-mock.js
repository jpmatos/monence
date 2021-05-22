const fs = require('fs').promises
const path = require('path')
const uuid = require('short-uuid')
const error = require('../object/error')

class DatabaseMock {
    static init() {
        DatabaseMock.readFile(path.join(__dirname, '/mock/calendars.json'))
            .then(res => {
                this.calendars = res
            })
        DatabaseMock.readFile(path.join(__dirname, '/mock/users.json'))
            .then(res => {
                this.users = res
            })
        return DatabaseMock
    }

    static getCalendar(calendarId) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.reject(error(404, 'Calendar Not Found'))
        return Promise.resolve(this.calendars[calendarIdx])
    }

    static postItem(calendarId, item, arrayName) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.reject(error(404, 'Calendar Not Found'))

        this.calendars[calendarIdx][arrayName].push(item)
        return Promise.resolve(item)
    }

    static deleteItem(calendarId, itemId, arrayName) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve({'message': `Could not find calendar ${calendarId}`})

        this.calendars[calendarIdx][arrayName] = this.calendars[calendarIdx][arrayName].filter((item) => item.id !== itemId)

        return Promise.resolve({'message': `Deleted item with id ${itemId}`})
    }

    static putItem(calendarId, itemId, item, arrayName) {
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

    static postBudget(calendarId, budget) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve({'message': `Could not find calendar ${calendarId}`})

        this.calendars[calendarIdx].budget.push(budget)

        return Promise.resolve(budget)
    }

    static putBudget(calendarId, budgetId, budget) {
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

    static deleteBudget(calendarId, budgetId) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve({'message': `Could not find calendar ${calendarId}`})

        this.calendars[calendarIdx].budget = this.calendars[calendarIdx].budget.filter((budget) => budget.id !== budgetId)

        return Promise.resolve({'message': `Deleted item with id ${budgetId}`})
    }

    static verifyNewUser(userId, name, emails, photos) {
        const userIdx = this.users.findIndex(user => user.id === userId)
        if(userIdx === -1){
            this.users.push({
                'id': userId,
                'name': name,
                'emails': emails,
                'photos': photos,
                'calendars': []
            })
            return Promise.resolve('Created new user')
        }
        return Promise.resolve('User already exists')
    }

    static getCalendars(userId) {
        const userIdx = this.users.findIndex(user => user.id === userId)
        if (userIdx === -1)
            return Promise.resolve({'message': `Could not find user ${userIdx}`})

        return Promise.resolve(this.users[userIdx].calendars)
    }

    static postCalendar(userId, calendar) {
        const userIdx = this.users.findIndex(user => user.id === userId)
        if (userIdx === -1)
            return Promise.resolve({'message': `Could not find user ${userIdx}`})

        calendar.id = uuid.generate()

        this.users[userIdx].calendars.push(calendar)
        this.calendars.push({
            "name": calendar.name,
            "ownerId": userId,
            "id": calendar.id,
            "single": [],
            "recurrent": [],
            "budget": {
                "week": [],
                "month": [],
                "year": []
            }
        })

        return Promise.resolve(calendar)
    }

    static readFile(filePath) {
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

module.exports = DatabaseMock.init()