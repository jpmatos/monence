const error = require("../object/error");
const postCalendarSchema = require('./joi-schemas/calendar-schemas').postCalendarSchema
const uuid = require('short-uuid')


class UserService {
    constructor(dbCalendar, dbUser) {
        this.dbCalendar = dbCalendar
        this.dbUser = dbUser
    }

    static init(dbCalendar, dbUser) {
        return new UserService(dbCalendar, dbUser)
    }

    verifyNewUser(userId, name, email, photos) {
        return this.dbUser.getUser(userId)
            .then(user => {
                if (user)
                    return {message: 'User already exists'}

                const newUser =
                    {
                        'id': userId,
                        'name': name,
                        'email': email,
                        'photos': photos,
                        'calendars': [],
                        'participating': []
                    }
                return this.dbUser.createNewUser(newUser)
                    .then(() => {
                        return {message: 'Created user'}
                    })
            })
    }

    getUser(userId) {
        return this.dbUser.getUser(userId)
            .then(user => {
                if (!user)
                    return Promise.reject(error(404, 'User not found'))
                return user
            })
    }

    postCalendar(userId, calendar) {
        const response = {body: null}
        return this.dbCalendar.startTransaction(response, error, session => {
            return () => {
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

                return this.dbUser.getUser(userId, session)
                    .then(user => {

                        calendar.owner = {
                            'ownerId': user.id,
                            'name': user.name,
                            'email': user.email
                        }

                        const userCalendar = {
                            'id': calendar.id,
                            'name': calendar.name
                        }

                        return Promise.all([
                            this.dbCalendar.postCalendar(calendar, session),
                            this.dbUser.postCalendarToUser(userId, userCalendar, session)
                        ])
                    })
                    .then(res => {
                        const user = res[1]
                        if (user.calendars.length === 0)
                            return Promise.reject(error(500, 'Failed create calendar'))

                        response.body = user.calendars[0]
                    })
            }
        })
    }
}

module.exports = UserService