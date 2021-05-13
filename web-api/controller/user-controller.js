const userService = require("../../service/user-service");

class UserController {
    static getCalendars(req, res, next){
        const userId = req.userId
        return userService.getCalendars(userId)
            .then(calendars => res.status(201).json(calendars))
            .catch(next)
    }
}

module.exports = UserController