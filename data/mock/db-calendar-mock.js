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
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve(null)

        return Promise.resolve(this.calendars[calendarIdx])
    }

    postCalendar(calendar) {
        this.calendars.push(calendar)

        return Promise.resolve(calendar)
    }

    // putCalendar(calendarId, calendar) {
    //     const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
    //     if (calendarIdx === -1)
    //         return Promise.reject(`Calendar Not Found`)
    //
    //     this.calendars[calendarIdx] = calendar
    //
    //     return Promise.resolve(calendar)
    // }

    deleteCalendar(calendarId) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve(null)

        const res = Object.assign({}, this.calendars[calendarIdx])
        this.calendars = this.calendars.filter(calendar => calendar.id !== calendarId)

        return Promise.resolve(res)
    }

    getCalendarOwner(calendarId) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve(null)

        return Promise.resolve({
            "owner": this.calendars[calendarIdx].owner
        })
    }

    getCalendarOwnerAndParticipant(calendarId) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve(null)

        return Promise.resolve({
            "owner": this.calendars[calendarIdx].owner,
            "participants": this.calendars[calendarIdx].participants
        })
    }

    getCalendarOwnerAndName(calendarId) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve(null)

        return Promise.resolve({
            "owner": this.calendars[calendarIdx].owner,
            "name": this.calendars[calendarIdx].name
        })
    }

    postItemSingle(calendarId, item) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve(null)

        this.calendars[calendarIdx].single.push(item)
        return Promise.resolve({
            "single": [item]
        })
    }

    postItemRecurrent(calendarId, item) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve(null)

        this.calendars[calendarIdx].recurrent.push(item)
        return Promise.resolve({
            "recurrent": [item]
        })
    }

    putItemSingle(calendarId, itemId, item) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve(null)

        const itemIdx = this.calendars[calendarIdx].single.findIndex(i => i.id === itemId)
        const currItem = this.calendars[calendarIdx].single[itemIdx]

        this.calendars[calendarIdx].single[itemIdx] = {
            'id': currItem.id,
            'title': !item.title || item.title.length === 0 ? currItem.title : item.title,
            'recurrency': currItem.recurrency,
            'type': currItem.type,
            'start': !item.start ? currItem.start : item.start,
            'value': !item.value || item.value === 0 ? currItem.value : item.value
        }

        return Promise.resolve({
                "single": [this.calendars[calendarIdx].single[itemIdx]]
            }
        )
    }

    putItemRecurrent(calendarId, itemId, item) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve(null)

        const itemIdx = this.calendars[calendarIdx].recurrent.findIndex(i => i.id === itemId)
        const currItem = this.calendars[calendarIdx].recurrent[itemIdx]

        this.calendars[calendarIdx].recurrent[itemIdx] = {
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
                "recurrent": [this.calendars[calendarIdx].recurrent[itemIdx]]
            }
        )
    }

    deleteItemSingle(calendarId, itemId) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve(null)

        const itemIdx = this.calendars[calendarIdx].single.findIndex(i => i.id === itemId)
        const res = Object.assign({}, this.calendars[calendarIdx].single[itemIdx])

        this.calendars[calendarIdx].single = this.calendars[calendarIdx].single.filter((item) => item.id !== itemId)

        return Promise.resolve({
            "single": [res]
        })
    }

    deleteItemRecurrent(calendarId, itemId) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve(null)

        const itemIdx = this.calendars[calendarIdx].recurrent.findIndex(i => i.id === itemId)
        const res = Object.assign({}, this.calendars[calendarIdx].recurrent[itemIdx])

        this.calendars[calendarIdx].recurrent = this.calendars[calendarIdx].recurrent.filter((item) => item.id !== itemId)

        return Promise.resolve({
            "recurrent": [res]
        })
    }

    postBudget(calendarId, budget) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve(null)

        this.calendars[calendarIdx].budget.push(budget)

        return Promise.resolve({
            "budget": [budget]
        })
    }

    putBudget(calendarId, budgetId, budget) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve(null)

        const budgetIdx = this.calendars[calendarIdx].budget.findIndex(i => i.id === budgetId)
        const currBudget = this.calendars[calendarIdx].budget[budgetIdx]

        this.calendars[calendarIdx].budget[budgetIdx] = {
            'id': currBudget.id,
            'date': !budget.date ? currBudget.date : budget.date,
            'value': !budget.value ? currBudget.value : budget.value,
            'period': currBudget.period
        }

        return Promise.resolve(
            {
                "budget": [this.calendars[calendarIdx].budget[budgetIdx]]
            }
        )
    }

    deleteBudget(calendarId, budgetId) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve(null)

        const budgetIdx = this.calendars[calendarIdx].budget.findIndex(i => i.id === budgetId)
        const res = Object.assign({}, this.calendars[calendarIdx].budget[budgetIdx])

        this.calendars[calendarIdx].budget = this.calendars[calendarIdx].budget.filter((budget) => budget.id !== budgetId)

        return Promise.resolve({
            "budget": [res]
        })
    }

    getParticipants(calendarId) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve(null)

        return Promise.resolve({
                "participants": this.calendars[calendarIdx].participants
            }
        )
    }

    postCalendarParticipant(calendarId, participant) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve(null)

        this.calendars[calendarIdx].participants.push(participant)

        return Promise.resolve({
            "participants": [participant]
        })
    }

    deleteParticipant(calendarId, participantId) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve(null)

        const participantIdx = this.calendars[calendarIdx].participants.findIndex(i => i.id === participantId)
        const res = Object.assign({}, this.calendars[calendarIdx].participants[participantIdx])

        this.calendars[calendarIdx].participants = this.calendars[calendarIdx].participants.filter(participant => participant.id !== participantId)

        return Promise.resolve(
            {
                'participants': [res]
            }
        )
    }

    putRole(calendarId, participantId, role) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve(null)

        const participantIdx = this.calendars[calendarIdx].participants.findIndex(i => i.id === participantId)
        const currParticipant = this.calendars[calendarIdx].participants[participantIdx]

        this.calendars[calendarIdx].participants[participantIdx] = {
            'id': currParticipant.id,
            'name': currParticipant.name,
            'email': currParticipant.email,
            'role': !role ? currParticipant.role : role
        }

        return Promise.resolve(
            {
                "participants": [this.calendars[calendarIdx].participants[participantIdx]]
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