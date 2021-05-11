const fs = require('fs').promises
const path = require('path')
const {v4: uuid} = require('uuid')

class DatabaseMock {
    static init() {
        DatabaseMock.readFile(path.join(__dirname, '/mock/calendars.json'))
            .then(res => {
                this.calendars = res
            })
        return DatabaseMock
    }

    static getCalendar(calendarId) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve({'message': `Could not find calendar ${calendarId}`})
        return Promise.resolve(this.calendars[calendarIdx])
    }

    static postItem(calendarId, item, arrayName) {
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve({'message': `Could not find calendar ${calendarId}`})

        item.id = uuid()

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

    static postBudget(calendarId, budget){
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve({'message': `Could not find calendar ${calendarId}`})

        this.calendars[calendarIdx].budget[budget.period].push(budget)

        return Promise.resolve(budget)
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