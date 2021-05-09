const db = require('../data/database-mock')

class CalendarService{

    static getCalendar(calendarId){
        return db.getCalendar(calendarId)
    }

    static postItem(calendarId, item){
        // let arrayName = ''
        // switch (item.type){
        //     case 'expense':
        //         delete item.end
        //         delete item.recurrencyPeriod
        //         arrayName = 'expenses'
        //         break
        //     // case 'expenserecurrent':
        //     //     arrayName = 'recurrentExpenses'
        //     //     break
        //     case 'gain':
        //         delete item.end
        //         delete item.recurrencyPeriod
        //         arrayName = 'gains'
        //         break
        //     // case 'gainrecurrent':
        //     //     arrayName = 'recurrentGains'
        //     //     break
        // }
        return db.postItem(calendarId, item, 'single')
    }

    static deleteItem(calendarId, itemId){
        return db.deleteItem(calendarId, itemId, 'single')
    }

    static putItem(calendarId, itemId, item){
        return db.putItem(calendarId, itemId, item, 'single')
    }

    static postItemRecurrent(calendarId, item){
        return db.postItem(calendarId, item, 'recurrent')
    }

    static deleteItemRecurrent(calendarId, itemId){
        return db.deleteItem(calendarId, itemId, 'recurrent')
    }

    static putItemRecurrent(calendarId, itemId, item){
        return db.putItem(calendarId, itemId, item, 'recurrent')
    }
}

module.exports = CalendarService