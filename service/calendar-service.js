const db = require('../data/database-mock')

class CalendarService{

    static getCalendar(calendarId){
        return db.getCalendar(calendarId)
    }

    static postItem(calendarId, item){
        return db.postItem(calendarId, item)
    }

    static deleteItem(calendarId, itemId){
        return db.deleteItem(calendarId, itemId)
    }

    static putItem(calendarId, itemId, item){
        return db.putItem(calendarId, itemId, item)
    }
}

module.exports = CalendarService