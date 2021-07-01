function userWebApi(router, userController) {
    router.get('/', (req, res, next) => {
        return userController.getUser(req, res, next)
    })

    router.post('/calendars', (req, res, next) => {
        return userController.postCalendar(req, res, next)
    })

    return router
}

module.exports = userWebApi

