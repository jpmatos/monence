const uuid = require('short-uuid')
const error = require("../object/error");

class InviteService {
    constructor(dbCalendar, dbUser, dbInvite) {
        this.dbCalendar = dbCalendar
        this.dbUser = dbUser
        this.dbInvite = dbInvite
    }

    static init(dbCalendar, dbUser, dbInvite){
        return new InviteService(dbCalendar, dbUser, dbInvite)
    }

    postInvite(userId, invite){
        return Promise.all([
            this.dbUser.getUserByEmail(invite.email),
            this.dbUser.getUser(userId),
            this.dbCalendar.getCalendarName(invite.calendarId)
        ])
            .then(res => {
                const invitee = res[0]
                const inviter = res[1]
                const calendarName = res[2]

                invite.id = uuid.generate()
                invite.inviteeId = invitee.id
                invite.inviterId = inviter.id
                invite.calendarName = calendarName
                invite.inviterName = inviter.name
                invite.inviteeName = invitee.name
                invite.inviteeEmail = invitee.email

                return this.dbInvite.postInvite(invite)
            })
    }

    getPending(userId) {
        return this.dbInvite.getPending(userId)
    }

    getSent(userId, calendarId) {
        return this.dbInvite.getSent(calendarId)
    }

    acceptInvite(userId, inviteId) {
        return this.dbInvite.deleteInvite(inviteId)
            .then(invite => {

                const participating = {
                    'calendarId': invite.calendarId,
                    'calendarName': invite.calendarName,
                    'role': invite.role
                }

                const participant = {
                    'id': invite.inviteeId,
                    'name': invite.inviteeName,
                    'email': invite.inviteeEmail,
                    'role': invite.role
                }

                return Promise.all([
                    this.dbUser.postParticipating(userId, participating),
                    this.dbCalendar.postCalendarParticipant(invite.calendarId, participant)
                ])
            })
            .then(res => {
                return res[0]
            })
    }

    deleteInvite(userId, inviteId) {
        return this.dbInvite.deleteInvite(inviteId)
            .then(invite => {
                return {'message': 'Deleted invite'}
            })
    }

    declineInvite(userId, inviteId) {
        return this.dbInvite.deleteInvite(inviteId)
            .then(invite => {
                return {'message': 'Declined invite'}
            })
    }
}

module.exports = InviteService