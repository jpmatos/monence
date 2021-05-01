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

    static getCalendar(calendarId){
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve({'message': `Could not find calendar ${calendarId}`})
        return Promise.resolve(this.calendars[calendarIdx])
    }

    static postItem(calendarId, item){
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve({'message': `Could not find calendar ${calendarId}`})

        item.id = uuid()

        this.calendars[calendarIdx].items.push(item)
        return Promise.resolve(item)
    }

    static deleteItem(calendarId, itemId){
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve({'message': `Could not find calendar ${calendarId}`})

        const itemIdx = this.calendars[calendarIdx].items.findIndex(item => item.id === itemId)
        if (itemIdx === -1)
            return Promise.resolve({'message': `Could not find item ${itemId}`})

        this.calendars[calendarIdx].items.splice(itemIdx, 1)
        return Promise.resolve({'message': `Deleted item with id ${itemId}`})
    }

    static putItem(calendarId, itemId, item){
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve({'message': `Could not find calendar ${calendarId}`})

        const itemIdx = this.calendars[calendarIdx].items.findIndex(i => i.id === itemId)
        if (itemIdx === -1)
            return Promise.resolve({'message': `Could not find item ${itemId}`})

        const currItem = this.calendars[calendarIdx].items[itemIdx]

        this.calendars[calendarIdx].items[itemIdx] = {
            'id': currItem.id,
            'title': !item.title || item.title.length === 0 ? currItem.title : item.title,
            'type': currItem.type,
            'allDay': currItem.allDay,
            'start': item.start,
            'end': item.end,
            'value': !item.value || item.value === 0 ? currItem.value : item.value
        }

        return Promise.resolve(this.calendars[calendarIdx].items[itemIdx])
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