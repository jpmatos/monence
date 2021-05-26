const checkAuth = require('../middleware/check-auth')

function calendarWebApi(router, calendarController){
    /* GET hello. */
    router.get('/hello', (req, res, next) => {
        return calendarController.hello(req, res, next)
    })
    router.get('/:calendarId', checkAuth, (req, res, next) => {
        return calendarController.getCalendar(req, res, next)
    })

    router.put('/:calendarId/share', checkAuth, ((req, res, next) => {
        return calendarController.putShare(req, res, next)
    }))

    //Single
    router.post('/:calendarId/item/single', checkAuth, (req, res, next) => {
        return calendarController.postItem(req, res, next)
    })

    router.delete('/:calendarId/item/single/:itemId', checkAuth, (req, res, next) => {
        return calendarController.deleteItem(req, res, next)
    })

    router.put('/:calendarId/item/single/:itemId', checkAuth, (req, res, next) => {
        return calendarController.putItem(req, res, next)
    })

    //Recurrent
    router.post('/:calendarId/item/recurrent', checkAuth, (req, res, next) => {
        return calendarController.postItemRecurrent(req, res, next)
    })

    router.delete('/:calendarId/item/recurrent/:itemId', checkAuth, (req, res, next) => {
        return calendarController.deleteItemRecurrent(req, res, next)
    })

    router.put('/:calendarId/item/recurrent/:itemId', checkAuth, (req, res, next) => {
        return calendarController.putItemRecurrent(req, res, next)
    })

    //Budget
    router.post('/:calendarId/budget', checkAuth, (req, res, next) => {
        return calendarController.postBudget(req, res, next)
    })

    router.put('/:calendarId/budget/:budgetId', checkAuth, (req, res, next) => {
        return calendarController.putBudget(req, res, next)
    })

    router.delete('/:calendarId/budget/:budgetId', checkAuth, ((req, res, next) => {
        return calendarController.deleteBudget(req, res, next)
    }))

    //Invites
    router.post('/:calendarId/invite', checkAuth, (req, res, next) => {
        return calendarController.postInvite(req, res, next)
    })

    router.delete('/:calendarId/invite/:inviteId', checkAuth, (req, res, next) => {
        return calendarController.deleteInvite(req, res, next)
    })

    return router
}

module.exports = calendarWebApi