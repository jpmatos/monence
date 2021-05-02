const db = require('../data/database-mock')

class CalendarService{

    static getCalendar(calendarId){
        return db.getCalendar(calendarId)
    }

    static postItem(calendarId, item, type, recurrency){
        let arrayName = ''
        switch (type+recurrency){
            case 'expensesingle':
                delete item.end
                delete item.recurrencyPeriod
                arrayName = 'expenses'
                break
            case 'expenserecurrent':
                arrayName = 'recurrentExpenses'
                break
            case 'gainsingle':
                delete item.end
                delete item.recurrencyPeriod
                arrayName = 'gains'
                break
            case 'gainrecurrent':
                arrayName = 'recurrentGains'
                break
        }
        return db.postItem(calendarId, item, arrayName)
    }

    static deleteItem(calendarId, itemId){
        return db.deleteItem(calendarId, itemId)
    }

    static putItem(calendarId, itemId, item){
        return db.putItem(calendarId, itemId, item)
    }
}

module.exports = CalendarService