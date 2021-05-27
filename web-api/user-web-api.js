
function userWebApi(router, userController) {
    router.get('/', (req, res, next) => {
        return userController.getUser(req, res, next)
    })

    router.post('/calendars', (req, res, next) => {
        return userController.postCalendar(req, res, next)
    })

    router.put('/invite/:inviteId/accept', (req, res, next) => {
        return userController.acceptInvite(req, res, next)
    })

    router.put('/invite/:inviteId/decline', (req, res, next) => {
        return userController.declineInvite(req, res, next)
    })

    return router
}

module.exports = userWebApi

