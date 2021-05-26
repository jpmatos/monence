const db = require(Boolean(process.env.MOCK_DB === 'true') ? '../data/database-mock' : '../data/database-mongo')
const dbExchanges = require(process.env.MOCK_EXCHANGE_DB === 'true' ? '../data/database-exchanges-mock' : '../data/database-exchanges')
const error = require("../object/error");
const postCalendarSchema = require('./joi-schemas/calendar-schemas').postCalendarSchema


class UserService {
    static verifyNewUser(userId, name, emails, photos) {
        const user =
            {
                'id': userId,
                'name': name,
                'emails': emails,
                'photos': photos,
                'calendars': [],
                'invites': []
            }
        return db.verifyNewUser(user)
    }

    static getCalendars(userId) {
        return db.getCalendars(userId)
    }

    static postCalendar(userId, calendar) {

        const result = postCalendarSchema.validate(calendar, {stripUnknown: true})
        if (result.error)
            return Promise.reject(error(400, result.error.details[0].message))
        calendar = Object.assign({}, result.value)

        calendar.ownerId = userId

        return Promise.all([db.postCalendar(userId, calendar), dbExchanges.getExchanges()])
            .then(res => {
                const calendar = res[0]
                const exchanges = res[1]
                calendar.exchanges = exchanges
                return calendar
            })
    }
}

module.exports =  UserService