const error = require("../object/error");
const postCalendarSchema = require('./joi-schemas/calendar-schemas').postCalendarSchema


class UserService {
    constructor(db, dbExchanges) {
        this.db = db
        this.dbExchanges = dbExchanges
    }

    static init(db, dbExchanges){
        return new UserService(db, dbExchanges)
    }

    verifyNewUser(userId, name, emails, photos) {
        const user =
            {
                'id': userId,
                'name': name,
                'emails': emails,
                'photos': photos,
                'calendars': [],
                'invites': []
            }
        return this.db.verifyNewUser(user)
    }

    getCalendars(userId) {
        return this.db.getCalendars(userId)
    }

    postCalendar(userId, calendar) {

        const result = postCalendarSchema.validate(calendar, {stripUnknown: true})
        if (result.error)
            return Promise.reject(error(400, result.error.details[0].message))
        calendar = Object.assign({}, result.value)

        calendar.ownerId = userId

        return Promise.all([this.db.postCalendar(userId, calendar), this.dbExchanges.getExchanges()])
            .then(res => {
                const calendar = res[0]
                const exchanges = res[1]
                calendar.exchanges = exchanges
                return calendar
            })
    }
}

module.exports =  UserService