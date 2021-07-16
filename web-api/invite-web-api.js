const checkAuth = require('../middleware/check-auth')

function inviteWebApi(router, inviteController) {

    router.post('/invite', checkAuth, (req, res, next) => {
        return inviteController.postInvite(req, res, next)
    })

    router.get('/invites/pending', checkAuth, (req, res, next) => {
        return inviteController.getPending(req, res, next)
    })

    router.get('/invites/sent/:calendarId', checkAuth, (req, res, next) => {
        return inviteController.getSent(req, res, next)
    })

    router.put('/invite/:inviteId/accept', checkAuth, (req, res, next) => {
        return inviteController.acceptInvite(req, res, next)
    })

    router.delete('/invite/:inviteId', checkAuth, (req, res, next) => {
        return inviteController.deleteInvite(req, res, next)
    })

    router.delete('/invite/:inviteId/decline', checkAuth, (req, res, next) => {
        return inviteController.declineInvite(req, res, next)
    })

    return router
}

module.exports = inviteWebApi

