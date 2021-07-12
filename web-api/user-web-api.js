const checkAuth = require('../middleware/check-auth')

function userWebApi(router, userController) {
    router.get('/', checkAuth, (req, res, next) => {
        return userController.getUser(req, res, next)
    })

    router.post('/calendars', checkAuth, (req, res, next) => {
        return userController.postCalendar(req, res, next)
    })

    return router
}

module.exports = userWebApi

