const error = require("../object/error");
const postCalendarSchema = require('./joi-schemas/calendar-schemas').postCalendarSchema


class UserService {
    constructor(db, dbExchanges) {
        this.db = db
        this.dbExchanges = dbExchanges
    }

    static init(db, dbExchanges) {
        return new UserService(db, dbExchanges)
    }

    verifyNewUser(userId, name, email, photos) {
        const user =
            {
                'id': userId,
                'name': name,
                'email': email,
                'photos': photos,
                'calendars': [],
                'invites': [],
                'invitedCalendars': []
            }
        return this.db.verifyNewUser(user)
    }

    getUser(userId) {
        return this.db.getUser(userId)
    }

    postCalendar(userId, calendar) {

        const result = postCalendarSchema.validate(calendar, {stripUnknown: true})
        if (result.error)
            return Promise.reject(error(400, result.error.details[0].message))
        calendar = Object.assign({}, result.value)

        calendar.ownerId = userId
        calendar.share = 'Personal'
        calendar.single = []
        calendar.recurrent = []
        calendar.budget = []
        calendar.invites = []

        return Promise.all([this.db.postCalendar(userId, calendar), this.dbExchanges.getExchanges()])
            .then(res => {
                const calendar = res[0]
                const exchanges = res[1]
                calendar.exchanges = exchanges
                return {
                    "id": calendar.id,
                    "name": calendar.name
                }
            })
    }

    acceptInvite(userId, inviteId) {
        return Promise.all([this.db.getUser(userId), this.db.deleteUserInvite(userId, inviteId)])
            .then(res => {
                const user = res[0]
                const invite = res[1]

                const invitee = {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email
                }

                return this.db.acceptCalendarInvite(invite.id, invite.calendarId, invitee)
            })
            .then(accept => {
                return this.db.postUserInvitedCalendar(userId, accept)
            })
    }

    declineInvite(userId, inviteId) {
        return this.db.deleteUserInvite(userId, inviteId)
            .then(invite => {
                return this.db.deleteCalendarInvite(invite.id, invite.calendarId)
            })
    }
}

module.exports = UserService