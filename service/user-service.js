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
        calendar.ownerId = userId
        calendar.share = 'Personal'
        calendar.single = []
        calendar.recurrent = []
        calendar.budget = []
        calendar.participants = []

        const userCalendar = {
            'id': calendar.id,
            'name': calendar.name
        }

        return Promise.all([this.db.postCalendar(userId, calendar), this.dbUser.postCalendarToUser(userId, userCalendar)])
            .then(() => {
                return userCalendar
            })
    }

    // getInvites(userId) {
    //     return this.dbUser.getUserInvites(userId)
    //         .then(invites => {
    //             return invites
    //         })
    // }

    // acceptInvite(userId, inviteId) {
    //     return Promise.all([this.dbUser.getUser(userId), this.dbUser.deleteUserInvite(userId, inviteId)])
    //         .then(res => {
    //             const user = res[0]
    //             const invite = res[1]
    //
    //             const invitee = {
    //                 "id": user.id,
    //                 "name": user.name,
    //                 "email": user.email
    //             }
    //
    //             return Promise.all([
    //                 this.db.postCalendarInvitee(invite.id, invite.calendarId, invitee),
    //                 this.db.deleteCalendarInvite(inviteId, invite.calendarId)
    //             ])
    //         })
    //         .then(res => {
    //             const accept = res[0]
    //             return this.dbUser.postUserInvitedCalendar(userId, accept)
    //         })
    // }

    // declineInvite(userId, inviteId) {
    //     return this.dbUser.deleteUserInvite(userId, inviteId)
    //         .then(invite => {
    //             return this.db.deleteCalendarInvite(invite.id, invite.calendarId)
    //         })
    // }
}

module.exports = UserService