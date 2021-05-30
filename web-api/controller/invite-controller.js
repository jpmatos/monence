const success = require("../../object/success");

class InviteController {
    constructor(inviteService) {
        this.inviteService = inviteService
    }

    static init(inviteService) {
        return new InviteController(inviteService)
    }

    postInvite(req, res, next) {
        const userId = req.user.id
        const invite = req.body
        return this.inviteService
            .postInvite(userId, invite)
            .then(invite => res.status(201).json(success(invite)))
            .catch(next)
    }

    getPending(req, res, next) {
        const userId = req.user.id
        return this.inviteService
            .getPending(userId)
            .then(invites => res.status(200).json(success(invites)))
            .catch(next)
    }

    getSent(req, res, next) {
        const userId = req.user.id
        const calendarId = req.params.calendarId
        return this.inviteService
            .getSent(userId, calendarId)
            .then(invites => res.status(200).json(success(invites)))
            .catch(next)
    }

    acceptInvite(req, res, next) {
        const userId = req.user.id
        const inviteId = req.params.inviteId
        return this.inviteService.acceptInvite(userId, inviteId)
            .then(participating => res.status(201).json(success(participating)))
            .catch(next)
    }

    deleteInvite(req, res, next) {
        const userId = req.user.id
        const inviteId = req.params.inviteId
        return this.inviteService.deleteInvite(userId, inviteId)
            .then(msg => res.status(201).json(success(msg)))
            .catch(next)
    }

    declineInvite(req, res, next) {
        const userId = req.user.id
        const inviteId = req.params.inviteId
        return this.inviteService.declineInvite(userId, inviteId)
            .then(msg => res.status(201).json(success(msg)))
            .catch(next)
    }
}

module.exports = InviteController