const success = require("../../object/success");

class UserController {
    constructor(userService) {
        this.userService = userService
    }

    static init(userService) {
        return new UserController(userService)
    }

    getUser(req, res, next) {
        const userId = req.user.id
        return this.userService.getUser(userId)
            .then(user => res.status(200).json(success(user)))
            .catch(next)
    }

    postCalendar(req, res, next) {
        const userId = req.user.id
        const calendar = req.body
        return this.userService.postCalendar(userId, calendar)
            .then(calendar => res.status(201).json(success(calendar)))
            .catch(next)
    }

    acceptInvite(req, res, next) {
        const userId = req.user.id
        const inviteId = req.params.inviteId
        return this.userService.acceptInvite(userId, inviteId)
            .then(invitedCalendar => res.status(201).json(success(invitedCalendar)))
            .catch(next)
    }

    declineInvite(req, res, next) {
        const userId = req.user.id
        const inviteId = req.params.inviteId
        return this.userService.declineInvite(userId, inviteId)
            .then(msg => res.status(201).json(success(msg)))
            .catch(next)
    }
}

module.exports = UserController