const error = require("../object/error");
const postCalendarSchema = require('./joi-schemas/calendar-schemas').postCalendarSchema
const uuid = require('short-uuid')


class UserService {
    constructor(db, dbUser) {
        this.db = db
        this.dbUser = dbUser
    }

    static init(db, dbUser) {
        return new UserService(db, dbUser)
    }

    verifyNewUser(userId, name, email, photos) {
        const user =
            {
                'id': userId,
                'name': name,
                'email': email,
                'photos': photos,
                'calendars': [],
                'participating': []
            }
        return this.dbUser.verifyNewUser(user)
    }

    getUser(userId) {
        return this.dbUser.getUser(userId)
    }

    postCalendar(userId, calendar) {

        const result = postCalendarSchema.validate(calendar, {stripUnknown: true})
        if (result.error)
            return Promise.reject(error(400, result.error.details[0].message))
        calendar = Object.assign({}, result.value)

        calendar.id = uuid.generate()
        calendar.share = 'Personal'
        calendar.single = []
        calendar.recurrent = []
        calendar.budget = []
        calendar.participants = []

        const userCalendar = {
            'id': calendar.id,
            'name': calendar.name
        }

        return this.dbUser.getUser(userId)
            .then(user => {

                calendar.owner = {
                    'ownerId': user.id,
                    'name': user.name,
                    'email': user.email
                }

                return Promise.all([this.db.postCalendar(userId, calendar), this.dbUser.postCalendarToUser(userId, userCalendar)])
                    .then(() => {
                        return userCalendar
                    })
            })


    }
}

module.exports = UserService