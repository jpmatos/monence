const db = require(Boolean(process.env.MOCK_DB === 'true') ? '../data/database-mock' : '../data/database-mongo')
const error = require("../object/error");
const postCalendarSchema = require('./joi-schemas/calendar-schemas').postCalendarSchema

class UserService {
    static verifyNewUser(userId, name, emails, photos) {
        return db.verifyNewUser(userId, name, emails, photos)
    }

    static getCalendars(userId) {
        return db.getCalendars(userId)
    }

    static postCalendar(userId, calendar) {

        const result = postCalendarSchema.validate(calendar, {stripUnknown: true})
        if (result.error)
            return Promise.reject(error(400, result.error.details[0].message))
        calendar = Object.assign({}, result.value)

        return db.postCalendar(userId, calendar)
    }
}

module.exports =  UserService