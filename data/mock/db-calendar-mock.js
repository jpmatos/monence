const fs = require('fs').promises
const path = require('path')

class DataBaseCalendarMock {
    constructor() {
        this.read = this.readFile(path.join(__dirname, '/mock-data/calendars.json'))
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

    isConnected() {
        return this.read
    }

    getCalendar(calendarId) {
        const calendar = this.calendars.find(calendar => calendar.id === calendarId)
        if (!calendar)
            return Promise.resolve(null)

        return Promise.resolve(calendar)
    }

    postCalendar(calendar) {
        this.calendars.push(calendar)

        return Promise.resolve(calendar)
    }

    putCalendarShare(calendarId, share) {
        const calendar = this.calendars.find(calendar => calendar.id === calendarId)
        if (!calendar)
            return Promise.resolve(null)

        calendar.share = !share ? calendar.share : share

        return Promise.resolve({
            share: calendar.share
        })
    }

    deleteCalendar(calendarId) {
        const calendar = this.calendars.find(calendar => calendar.id === calendarId)
        if (!calendar)
            return Promise.resolve(null)

        const res = Object.assign({}, calendar)
        this.calendars = this.calendars.filter(calendar => calendar.id !== calendarId)

        return Promise.resolve(res)
    }

    getCalendarOwner(calendarId) {
        const calendar = this.calendars.find(calendar => calendar.id === calendarId)
        if (!calendar)
            return Promise.resolve(null)

        return Promise.resolve({
            "owner": calendar.owner
        })
    }

    getCalendarOwnerAndParticipant(calendarId) {
        const calendar = this.calendars.find(calendar => calendar.id === calendarId)
        if (!calendar)
            return Promise.resolve(null)

        return Promise.resolve({
            "owner": calendar.owner,
            "participants": calendar.participants
        })
    }

    getCalendarOwnerAndName(calendarId) {
        const calendar = this.calendars.find(calendar => calendar.id === calendarId)
        if (!calendar)
            return Promise.resolve(null)

        return Promise.resolve({
            "owner": calendar.owner,
            "name": calendar.name
        })
    }

    postItemSingle(calendarId, item) {
        const calendar = this.calendars.find(calendar => calendar.id === calendarId)
        if (!calendar)
            return Promise.resolve(null)

        calendar.single.push(item)

        return Promise.resolve({
            "single": [item]
        })
    }

    postItemRecurrent(calendarId, item) {
        const calendar = this.calendars.find(calendar => calendar.id === calendarId)
        if (!calendar)
            return Promise.resolve(null)

        calendar.recurrent.push(item)

        return Promise.resolve({
            "recurrent": [item]
        })
    }

    putItemSingle(calendarId, itemId, item) {
        const calendar = this.calendars.find(calendar => calendar.id === calendarId)
        if (!calendar)
            return Promise.resolve(null)

        const itemIdx = calendar.single.findIndex(i => i.id === itemId)
        const currItem = calendar.single[itemIdx]

        calendar.single[itemIdx] = {
            'id': currItem.id,
            'title': !item.title || item.title.length === 0 ? currItem.title : item.title,
            'recurrency': currItem.recurrency,
            'type': currItem.type,
            'start': !item.start ? currItem.start : item.start,
            'value': !item.value || item.value === 0 ? currItem.value : item.value
        }

        return Promise.resolve({
                "single": [calendar.single[itemIdx]]
            }
        )
    }

    putItemRecurrent(calendarId, itemId, item) {
        const calendar = this.calendars.find(calendar => calendar.id === calendarId)
        if (!calendar)
            return Promise.resolve(null)

        const itemIdx = calendar.recurrent.findIndex(i => i.id === itemId)
        const currItem = calendar.recurrent[itemIdx]

        calendar.recurrent[itemIdx] = {
            'id': currItem.id,
            'title': !item.title || item.title.length === 0 ? currItem.title : item.title,
            'recurrency': currItem.recurrency,
            'recurrencyPeriod': currItem.recurrencyPeriod,
            'type': currItem.type,
            'start': !item.start ? currItem.start : item.start,
            'end': !item.end ? currItem.end : item.end,
            'value': !item.value || item.value === 0 ? currItem.value : item.value
        }

        return Promise.resolve(
            {
                "recurrent": [calendar.recurrent[itemIdx]]
            }
        )
    }

    deleteItemSingle(calendarId, itemId) {
        const calendar = this.calendars.find(calendar => calendar.id === calendarId)
        if (!calendar)
            return Promise.resolve(null)

        const item = calendar.single.find(i => i.id === itemId)
        const res = Object.assign({}, item)

        calendar.single = calendar.single.filter((item) => item.id !== itemId)

        return Promise.resolve({
            "single": [res]
        })
    }

    deleteItemRecurrent(calendarId, itemId) {
        const calendar = this.calendars.find(calendar => calendar.id === calendarId)
        if (!calendar)
            return Promise.resolve(null)

        const item = calendar.recurrent.find(i => i.id === itemId)
        const res = Object.assign({}, item)

        calendar.recurrent = calendar.recurrent.filter((item) => item.id !== itemId)

        return Promise.resolve({
            "recurrent": [res]
        })
    }

    postBudget(calendarId, budget) {
        const calendar = this.calendars.find(calendar => calendar.id === calendarId)
        if (!calendar)
            return Promise.resolve(null)

        calendar.budget.push(budget)

        return Promise.resolve({
            "budget": [budget]
        })
    }

    putBudget(calendarId, budgetId, budget) {
        const calendar = this.calendars.find(calendar => calendar.id === calendarId)
        if (!calendar)
            return Promise.resolve(null)

        const budgetIdx = calendar.budget.findIndex(i => i.id === budgetId)
        const currBudget = calendar.budget[budgetIdx]

        calendar.budget[budgetIdx] = {
            'id': currBudget.id,
            'date': !budget.date ? currBudget.date : budget.date,
            'value': !budget.value ? currBudget.value : budget.value,
            'period': currBudget.period
        }

        return Promise.resolve(
            {
                "budget": [calendar.budget[budgetIdx]]
            }
        )
    }

    deleteBudget(calendarId, budgetId) {
        const calendar = this.calendars.find(calendar => calendar.id === calendarId)
        if (!calendar)
            return Promise.resolve(null)

        const budget = calendar.budget.find(i => i.id === budgetId)
        const res = Object.assign({}, budget)

        calendar.budget = calendar.budget.filter((budget) => budget.id !== budgetId)

        return Promise.resolve({
            "budget": [res]
        })
    }

    getParticipants(calendarId) {
        const calendar = this.calendars.find(calendar => calendar.id === calendarId)
        if (!calendar)
            return Promise.resolve(null)

        return Promise.resolve({
                "participants": calendar.participants
            }
        )
    }

    postCalendarParticipant(calendarId, participant) {
        const calendar = this.calendars.find(calendar => calendar.id === calendarId)
        if (!calendar)
            return Promise.resolve(null)

        calendar.participants.push(participant)

        return Promise.resolve({
            "participants": [participant]
        })
    }

    deleteParticipant(calendarId, participantId) {
        const calendar = this.calendars.find(calendar => calendar.id === calendarId)
        if (!calendar)
            return Promise.resolve(null)

        const participant = calendar.participants.find(i => i.id === participantId)
        const res = Object.assign({}, participant)

        calendar.participants = calendar.participants.filter(participant => participant.id !== participantId)

        return Promise.resolve(
            {
                'participants': [res]
            }
        )
    }

    putRole(calendarId, participantId, role) {
        const calendar = this.calendars.find(calendar => calendar.id === calendarId)
        if (!calendar)
            return Promise.resolve(null)

        const participantIdx = calendar.participants.findIndex(i => i.id === participantId)
        const currParticipant = calendar.participants[participantIdx]

        calendar.participants[participantIdx] = {
            'id': currParticipant.id,
            'name': currParticipant.name,
            'email': currParticipant.email,
            'role': !role ? currParticipant.role : role
        }

        return Promise.resolve(
            {
                "participants": [calendar.participants[participantIdx]]
            }
        )
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