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

    static postItem(calendarId, item, arrayName){
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve({'message': `Could not find calendar ${calendarId}`})

        item.id = uuid()

        this.calendars[calendarIdx][arrayName].push(item)
        return Promise.resolve(item)
    }

    static deleteItem(calendarId, itemId){
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve({'message': `Could not find calendar ${calendarId}`})

        const arrNames = ["expenses", "gains", "recurrentExpenses", "recurrentGains"]
        arrNames.forEach(arrName => {
            this.calendars[calendarIdx][arrName] = this.calendars[calendarIdx][arrName].filter((item) => item.id !== itemId)
        })

        return Promise.resolve({'message': `Deleted item with id ${itemId}`})
    }

    static putItem(calendarId, itemId, item){
        const calendarIdx = this.calendars.findIndex(calendar => calendar.id === calendarId)
        if (calendarIdx === -1)
            return Promise.resolve({'message': `Could not find calendar ${calendarId}`})

        let itemIdx = -1, type = ''
        const arrNames = ["expenses", "gains", "recurrentExpenses", "recurrentGains"]
        arrNames.some(arrName => {
            itemIdx = this.calendars[calendarIdx][arrName].findIndex(i => i.id === itemId)
            if(itemIdx !== -1){
                type = arrName
                return true
            }
        })
        const currItem = this.calendars[calendarIdx][type][itemIdx]

        this.calendars[calendarIdx][type][itemIdx] = {
            'id': currItem.id,
            'title': !item.title || item.title.length === 0 ? currItem.title : item.title,
            'type': currItem.type,
            'start': item.start,
            'value': !item.value || item.value === 0 ? currItem.value : item.value
        }

        return Promise.resolve(this.calendars[calendarIdx][type][itemIdx])
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