const userService = require("../../service/user-service");
const success = require("../../object/success");

class UserController {
    static getCalendars(req, res, next){
        const userId = req.user.id
        return userService.getCalendars(userId)
            .then(calendars => res.status(200).json(success(calendars)))
            .catch(next)
    }

    static postCalendar(req, res, next){
        const userId = req.user.id
        const calendar = req.body
        return userService.postCalendar(userId, calendar)
            .then(calendar => res.status(201).json(success(calendar)))
            .catch(next)
    }
}

module.exports = UserController