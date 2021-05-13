const db = require('../data/database-mock')

class UserService {
    static verifyNewUser(userId, name, emails, photos) {
        return db.verifyNewUser(userId, name, emails, photos)
    }

    static getCalendars(userId) {
        return db.getCalendars(userId)
    }
}

module.exports =  UserService