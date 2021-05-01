const db = require('../data/database-mock')

class CalendarService{

    static getCalendar(calendarId){
        return db.getCalendar(calendarId)
    }

    static postExpense(calendarId, expense){
        expense.type = 'expense'
        return db.postItem(calendarId, expense, 'expenses')
    }

    static deleteExpense(calendarId, expenseId){
        return db.deleteItem(calendarId, expenseId, 'expenses')
    }

    static putExpense(calendarId, expenseId, expense){
        return db.putItem(calendarId, expenseId, expense, 'expenses')
    }

    static postGain(calendarId, gain){
        gain.type = 'gain'
        return db.postItem(calendarId, gain, 'gains')
    }

    static deleteGain(calendarId, gainId){
        return db.deleteItem(calendarId, gainId, 'gains')
    }

    static putGain(calendarId, gainId, gain){
        return db.putItem(calendarId, gainId, gain, 'gains')
    }
}

module.exports = CalendarService