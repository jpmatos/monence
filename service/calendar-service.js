const db = require('../data/database-mock')

class CalendarService{

    static getCalendar(calendarId){
        return db.getCalendar(calendarId)
    }

    static postExpense(calendarId, item){
        return db.postItem(calendarId, item, 'expenses')
    }

    static deleteExpense(calendarId, itemId){
        return db.deleteItem(calendarId, itemId, 'expenses')
    }

    static putExpense(calendarId, itemId, item){
        return db.putItem(calendarId, itemId, item, 'expenses')
    }
}

module.exports = CalendarService