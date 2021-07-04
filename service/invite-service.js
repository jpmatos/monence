const uuid = require('short-uuid')
const error = require("../object/error")
const roleCheck = require('./roles/roleCheck')
const postInviteSchema = require("./joi-schemas/invite-schemas").postInviteSchema

class InviteService {
    constructor(dbCalendar, dbUser, dbInvite, socketManager) {
        this.dbCalendar = dbCalendar
        this.dbUser = dbUser
        this.dbInvite = dbInvite
        this.socketManager = socketManager
    }

    static init(dbCalendar, dbUser, dbInvite, socketManager) {
        return new InviteService(dbCalendar, dbUser, dbInvite, socketManager)
    }

    postInvite(userId, invite) {
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

                if (!calendar || !roleCheck.isOwner(calendar, userId))
                    return Promise.reject(error(404, 'Calendar not found'))

                if (!invitee)
                    return Promise.reject(error(404, 'User not found'))

                invite.id = uuid.generate()
                invite.inviteeId = invitee.id
                invite.inviterId = inviter.id
                invite.calendarName = calendar.name
                invite.inviterName = inviter.name
                invite.inviteeName = invitee.name
                invite.inviteeEmail = invitee.email

                return this.dbInvite.postInvite(invite)
            })
            .then(invite => {
                this.socketManager.toNewInvite(invite)
                return invite
            })
    }

    getPending(userId) {
        return this.dbInvite.getPending(userId)
    }

    getSent(userId, calendarId) {
        return this.dbCalendar.getCalendarOwner(calendarId)
            .then(calendar => {
                if (!calendar || !roleCheck.isOwner(calendar, userId))
                    return Promise.reject(error(404, 'Calendar not found'))

                return this.dbInvite.getSent(calendarId)
            })
    }

    acceptInvite(userId, inviteId) {
        const response = {body: null}
        return this.dbCalendar.startTransaction(response, error, session => {
            return () => {
                return this.dbInvite.getInviteeId(inviteId, session)
                    .then(invite => {
                        if (!invite || !roleCheck.isSame(userId, invite.inviteeId))
                            return Promise.reject(error(404, 'Invite not found'))

                        return this.dbInvite.deleteInvite(inviteId, session)
                    })
                    .then(invite => {
                        if (!invite)
                            return Promise.reject(error(404, 'Invite not found'))

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
                            this.dbUser.postParticipating(userId, participating, session),
                            this.dbCalendar.postCalendarParticipant(invite.calendarId, participant, session),
                            invite.inviterId
                        ])
                    })
                    .then(res => {
                        const user = res[0]
                        const participant = res[1].participants[0]
                        const inviterId = res[2]
                        if (user.participating.length === 0)
                            return Promise.reject(error(500, 'Failed to register user as participant'))

                        return Promise.all([
                            user.participating[0],
                            participant,
                            inviterId
                        ])
                    })
                    .then(res => {
                        const participants = res[0]
                        const participant = res[1]
                        const inviterId = res[2]

                        this.socketManager.toAcceptInvite(inviterId, participant)

                        response.body = participants
                    })
            }
        })
    }

    deleteInvite(userId, inviteId) {
        return this.dbInvite.getInviterId(inviteId)
            .then(invite => {
                if (!invite || !roleCheck.isSame(userId, invite.inviterId))
                    return Promise.reject(error(404, 'Invite not found'))

                return this.dbInvite.deleteInvite(inviteId)
            })
            .then(invite => {
                if (!invite)
                    return Promise.reject(error(404, 'Invite not found'))

                return invite
            })
            .then(invite => {
                this.socketManager.toDeleteInvite(invite.inviteeId, invite.id)

                return invite
            })
    }

    declineInvite(userId, inviteId) {
        return this.dbInvite.getInviteeId(inviteId)
            .then(invite => {
                if (!invite || !roleCheck.isSame(userId, invite.inviteeId))
                    return Promise.reject(error(404, 'Invite not found'))

                return this.dbInvite.deleteInvite(inviteId)
            })
            .then(invite => {
                if (!invite)
                    return Promise.reject(error(404, 'Invite not found'))

                return invite
            })
            .then(invite => {
                this.socketManager.toDeclineInvite(invite.inviterId, invite.id)

                return invite
            })
    }
}

module.exports = InviteService