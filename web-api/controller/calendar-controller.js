const success = require("../../object/success");

class CalendarController {
    constructor(calendarService) {
        this.calendarService = calendarService
    }

    static init(calendarService) {
        return new CalendarController(calendarService)
    }

    hello(req, res, next) {
        return Promise.resolve()
            .then(() => {
                res.status(200).json({message: 'Hello'})
            })
            .catch(next)
    }

    getCalendar(req, res, next) {
        const userId = req.user.id
        const calendarId = req.params.calendarId
        return this.calendarService
            .getCalendar(calendarId, userId)
            .then(calendar => res.status(200).json(success(calendar)))
            .catch(next)
    }

    putShare(req, res, next) {
        const userId = req.user.id
        const calendarId = req.params.calendarId
        return this.calendarService
            .putShare(calendarId, userId)
            .then(msg => res.status(201).json(success(msg)))
            .catch(next)
    }

    postItem(req, res, next) {
        const userId = req.user.id
        const calendarId = req.params.calendarId
        const item = req.body
        return this.calendarService
            .postItem(calendarId, item, userId)
            .then(item => res.status(201).json(success(item)))
            .catch(next)
    }

    deleteItem(req, res, next) {
        const userId = req.user.id
        const calendarId = req.params.calendarId
        const itemId = req.params.itemId
        return this.calendarService
            .deleteItem(calendarId, itemId, userId)
            .then(msg => res.status(201).json(success(msg)))
            .catch(next)
    }

    putItem(req, res, next) {
        const userId = req.user.id
        const calendarId = req.params.calendarId
        const itemId = req.params.itemId
        const item = req.body
        return this.calendarService
            .putItem(calendarId, itemId, item, userId)
            .then(item => res.status(201).json(success(item)))
            .catch(next)
    }

    //Recurrent
    postItemRecurrent(req, res, next) {
        const userId = req.user.id
        const calendarId = req.params.calendarId
        const item = req.body
        return this.calendarService
            .postItemRecurrent(calendarId, item, userId)
            .then(item => res.status(201).json(success(item)))
            .catch(next)
    }

    deleteItemRecurrent(req, res, next) {
        const userId = req.user.id
        const calendarId = req.params.calendarId
        const itemId = req.params.itemId
        return this.calendarService
            .deleteItemRecurrent(calendarId, itemId, userId)
            .then(msg => res.status(201).json(success(msg)))
            .catch(next)
    }

    putItemRecurrent(req, res, next) {
        const userId = req.user.id
        const calendarId = req.params.calendarId
        const itemId = req.params.itemId
        const item = req.body
        return this.calendarService
            .putItemRecurrent(calendarId, itemId, item, userId)
            .then(item => res.status(201).json(success(item)))
            .catch(next)
    }

    //Budget
    postBudget(req, res, next) {
        const userId = req.user.id
        const calendarId = req.params.calendarId
        const budget = req.body
        return this.calendarService
            .postBudget(calendarId, budget, userId)
            .then(budget => res.status(201).json(success(budget)))
            .catch(next)
    }

    putBudget(req, res, next) {
        const userId = req.user.id
        const calendarId = req.params.calendarId
        const budgetId = req.params.budgetId
        const budget = req.body
        return this.calendarService
            .putBudget(calendarId, budgetId, budget, userId)
            .then(budget => res.status(201).json(success(budget)))
            .catch(next)
    }

    deleteBudget(req, res, next) {
        const userId = req.user.id
        const calendarId = req.params.calendarId
        const budgetId = req.params.budgetId
        return this.calendarService
            .deleteBudget(calendarId, budgetId, userId)
            .then(msg => res.status(201).json(success(msg)))
            .catch(next)
    }

    //Invites
    postInvite(req, res, next) {
        const userId = req.user.id
        const username = req.user.displayName
        const calendarId = req.params.calendarId
        const invite = req.body
        return this.calendarService
            .postInvite(calendarId, invite, username, userId)
            .then(invite => res.status(201).json(success(invite)))
            .catch(next)
    }

    deleteInvite(req, res, next) {
        const userId = req.user.id
        const calendarId = req.params.calendarId
        const inviteId = req.params.inviteId
        return this.calendarService
            .deleteInvite(calendarId, inviteId, userId)
            .then(msg => res.status(201).json(success(msg)))
            .catch(next)
    }
}

module.exports = CalendarController