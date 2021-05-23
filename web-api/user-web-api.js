const userController = require("./controller/user-controller");

function userWebApi(router) {
    router.get('/calendars', (req, res, next) => {
        return userController.getCalendars(req, res, next)
    })

    router.post('/calendars', (req, res, next) => {
        return userController.postCalendar(req, res, next)
    })

    return router
}

module.exports = userWebApi

