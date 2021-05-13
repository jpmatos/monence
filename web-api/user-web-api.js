const userController = require("./controller/user-controller");

function userWebApi(router) {
    router.get('/calendars', (req, res, next) => {
        userController.getCalendars(req, res, next)
    })

    return router
}

module.exports = userWebApi

