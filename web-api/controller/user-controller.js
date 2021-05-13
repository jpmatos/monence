const userService = require("../../service/user-service");

class UserController {
    static getCalendars(req, res, next){
        const userId = req.user.id
        return userService.getCalendars(userId)
            .then(calendars => res.status(200).json(calendars))
            .catch(next)
    }

    static postCalendar(req, res, next){
        const userId = req.user.id
        const calendar = req.body
        return userService.postCalendar(userId, calendar)
            .then(calendar => res.status(201).json(calendar))
    }
}

module.exports = UserController