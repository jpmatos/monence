const uuid = require('short-uuid')
const error = require("../object/error")
const roleCheck = require('./roles/roleCheck')
const postInviteSchema = require("./joi-schemas/invite-schemas").postInviteSchema

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
        const result = postInviteSchema.validate(invite, {stripUnknown: true})
        if (result.error)
            return Promise.reject(error(400, result.error.details[0].message))
        invite = Object.assign({}, result.value)

        return Promise.all([
            this.dbUser.getUserByEmail(invite.email),
            this.dbUser.getUser(userId),
            this.dbCalendar.getCalendarOwnerAndName(invite.calendarId)
        ])
            .then(res => {
                const invitee = res[0]
                const inviter = res[1]
                const calendar = res[2]

                if(!calendar || !roleCheck.isOwner(calendar, userId))
                    return Promise.reject(error(404, 'Calendar Not Found'))

                if(!invitee)
                    return Promise.reject(error(404, 'User Not Found'))

                invite.id = uuid.generate()
                invite.inviteeId = invitee.id
                invite.inviterId = inviter.id
                invite.calendarName = calendar.name
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
        return this.dbCalendar.getCalendarOwner(calendarId)
            .then(calendar => {
                if(!calendar || !roleCheck.isOwner(calendar, userId))
                    return Promise.reject(error(404, 'Calendar Not Found'))

                return this.dbInvite.getSent(calendarId)
            })
    }

    acceptInvite(userId, inviteId) {
        return this.dbInvite.getInviteeId(inviteId)
            .then(invite => {
                if(!invite || !roleCheck.isSame(userId, invite.inviteeId))
                    return Promise.reject(error(404, 'Invite Not Found'))

                return this.dbInvite.deleteInvite(inviteId)
            })
            .then(invite => {
                if(!invite)
                    return Promise.reject(error(404, 'Invite Not Found'))

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
                return res[0].participating[0]
            })
    }

    deleteInvite(userId, inviteId) {
        return this.dbInvite.getInviterId(inviteId)
            .then(invite => {
                if(!invite || !roleCheck.isSame(userId, invite.inviterId))
                    return Promise.reject(error(404, 'Invite Not Found'))

                return this.dbInvite.deleteInvite(inviteId)
            })
            .then(invite => {
                if(!invite)
                    return Promise.reject(error(404, 'Invite Not Found'))

                return {'message': 'Deleted invite'}
            })
    }

    declineInvite(userId, inviteId) {
        return this.dbInvite.getInviteeId(inviteId)
            .then(invite => {
                if(!invite || !roleCheck.isSame(userId, invite.inviteeId))
                    return Promise.reject(error(404, 'Invite Not Found'))

                return this.dbInvite.deleteInvite(inviteId)
            })
            .then(invite => {
                if(!invite)
                    return Promise.reject(error(404, 'Invite Not Found'))

                return {'message': 'Declined invite'}
            })
    }
}

module.exports = InviteService