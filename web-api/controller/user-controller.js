const success = require("../../object/success");

class UserController {
    constructor(userService) {
        this.userService = userService
    }

    static init(userService){
        return new UserController(userService)
    }

    getCalendars(req, res, next){
        const userId = req.user.id
        return this.userService.getCalendars(userId)
            .then(calendars => res.status(200).json(success(calendars)))
            .catch(next)
    }

    postCalendar(req, res, next){
        const userId = req.user.id
        const calendar = req.body
        return this.userService.postCalendar(userId, calendar)
            .then(calendar => res.status(201).json(success(calendar)))
            .catch(next)
    }
}

module.exports = UserController