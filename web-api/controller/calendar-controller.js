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

    deleteCalendar(req, res, next) {
        const userId = req.user.id
        const calendarId = req.params.calendarId
        return this.calendarService
            .deleteCalendar(calendarId, userId)
            .then(calendar => res.status(200).json(success(calendar)))
            .catch(next)
    }

    getParticipants(req, res, next) {
        const userId = req.user.id
        const calendarId = req.params.calendarId
        return this.calendarService
            .getParticipants(userId, calendarId)
            .then(participants => res.status(200).json(success(participants)))
            .catch(next)
    }

    deleteParticipant(req, res, next) {
        const userId = req.user.id
        const calendarId = req.params.calendarId
        const participantId = req.params.userId
        return this.calendarService
            .deleteParticipant(calendarId, participantId, userId)
            .then(participants => res.status(201).json(success(participants)))
            .catch(next)
    }

    leaveCalendar(req, res, next) {
        const userId = req.user.id
        const calendarId = req.params.calendarId
        return this.calendarService
            .deleteParticipant(calendarId, userId, userId)
            .then(participants => res.status(201).json(success(participants)))
            .catch(next)
    }

    changeRole(req, res, next) {
        const userId = req.user.id
        const calendarId = req.params.calendarId
        const participantId = req.params.userId
        const role = req.body
        return this.calendarService
            .changeRole(calendarId, participantId, role, userId)
            .then(participant => res.status(201).json(success(participant)))
            .catch(next)
    }

    putShare(req, res, next) {
        const userId = req.user.id
        const calendarId = req.params.calendarId
        return this.calendarService
            .putShare(calendarId, userId)
            .then(calendar => res.status(201).json(success(calendar)))
            .catch(next)
    }

    putUnshare(req, res, next) {
        const userId = req.user.id
        const calendarId = req.params.calendarId
        return this.calendarService
            .putUnshare(calendarId, userId)
            .then(calendar => res.status(201).json(success(calendar)))
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
            .then(item => res.status(201).json(success(item)))
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
            .then(item => res.status(201).json(success(item)))
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
            .then(budget => res.status(201).json(success(budget)))
            .catch(next)
    }
}

module.exports = CalendarController