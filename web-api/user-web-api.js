
function userWebApi(router, userController) {
    router.get('/calendars', (req, res, next) => {
        return userController.getCalendars(req, res, next)
    })

    router.post('/calendars', (req, res, next) => {
        return userController.postCalendar(req, res, next)
    })

    return router
}

module.exports = userWebApi

