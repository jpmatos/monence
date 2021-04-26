const db = require('../data/database-mock')

class CalendarService{

    static getCalendar(calendarId){
        return db.getCalendar(calendarId)
    }

    static postItem(calendarId, item){
        return db.postItem(calendarId, item)
    }

}

module.exports = CalendarService