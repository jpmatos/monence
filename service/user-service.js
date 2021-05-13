const db = require('../data/database-mock')

class UserService {
    static verifyNewUser(userId) {
        return db.verifyNewUser(userId)
    }

    static getCalendars(userId) {
        return db.getCalendars(userId)
    }
}

module.exports =  UserService