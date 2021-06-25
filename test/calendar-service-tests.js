const expect = require('chai').expect

//Load env variables
const env = require('../env.json')
Object.assign(process.env, env)
let socketManager = require('../middleware/socket-manager').init()

//See if mock API is set
let dbCalendar
if (process.env.MOCK_CALENDAR_DB === 'true')
    dbCalendar = require('../data/mock/db-calendar-mock').init()
else
    dbCalendar = require('../data/db-calendar-mongo').init(process.env.CONNECTION_STRING)

let dbUser
if (process.env.MOCK_USER_DB === 'true')
    dbUser = require('../data/mock/db-user-mock').init()
else
    dbUser = require('../data/db-user-mongo').init(process.env.CONNECTION_STRING)

let dbInvite
if (process.env.MOCK_INVITE_DB === 'true')
    dbInvite = require('../data/mock/db-invite-mock').init()
else
    dbInvite = require('../data/db-invite-mongo').init(process.env.CONNECTION_STRING)

let dbExchanges
if (process.env.MOCK_EXCHANGE_DB === 'true')
    dbExchanges = require('../data/mock/db-exchanges-mock').init()
else
    dbExchanges = require('../data/db-exchanges-api').init(process.env.OER_ID)

let calendarService = require('../service/calendar-service').init(dbCalendar, dbUser, dbExchanges, socketManager)

describe('Monence tests for calendar service', () => {
    const userId = 'testuserid12300000000'
    const calendarId = 'testcalendarid12300000'
    const calendarToPost = {
        "name": "TestCalendar",
        "currency": "EUR",
        "id": calendarId,
        "share": "Personal",
        "single": [],
        "recurrent": [],
        "budget": [],
        "participants": [],
        "owner": {
            "ownerId": userId,
            "name": "Test User",
            "email": "test.user@gmail.com"
        }
    }
    let itemSingleId = "testitemsingleid123000"
    const itemSingleToPost = {
        "id": itemSingleId,
        "title": "Test Single Item",
        "start": "2021-05-14T00:00:00.000Z",
        "value": 20.55,
        "type": "expense",
        "recurrency": "single"
    }
    let itemRecurrentId = "testitemrecurrentid12"
    const itemRecurrentToPost = {
        "id": itemRecurrentId,
        "title": "Test Recurrent Item",
        "start": "2021-05-14T00:00:00.000Z",
        "end": "2021-05-21T00:00:00.000Z",
        "value": 20.55,
        "type": "expense",
        "recurrency": "recurrent",
        "recurrencyPeriod": "week"
    }
    const itemSingleToUpdate = {
        "start": "2021-05-16T00:00:00.000Z"
    }
    const itemRecurrentToUpdate = {
        "start": "2021-05-16T00:00:00.000Z"
    }
    let budgetId = "testbudgetid123000000"
    const budgetToPost = {
        "id": budgetId,
        "date": "2021-05-01T00:00:00.000Z",
        "value": 200.00,
        "period": "week"
    }
    const budgetToUpdate = {
        "value": 250.00
    }
    const participantToPost = {
        'id': 'testuserid12400000000',
        'name': 'Test User 2',
        'email': 'test.user2@gmail.com',
        'role': 'Viewer'
    }
    const roleToUpdate = {
        'role': 'Viewer'
    }

    before(() => {
        return dbCalendar.isConnected()
            .then(() => {
                    return dbCalendar.postCalendar(calendarToPost)
                }
            )
    })


    after(() => {
        return dbCalendar.deleteCalendar(calendarId)
            .then(calendar => {
                expect(calendar.name).to.eql(calendarToPost.name)
                expect(calendar.currency).to.eql(calendarToPost.currency)
                expect(calendar.id).to.eql(calendarToPost.id)
                expect(calendar.share).to.eql(calendarToPost.share)
                expect(calendar.single).to.be.a('array')
                expect(calendar.recurrent).to.be.a('array')
                expect(calendar.budget).to.be.a('array')
                expect(calendar.participants).to.be.a('array')
                expect(calendar.owner.ownerId).to.eql(calendarToPost.owner.ownerId)
                expect(calendar.owner.name).to.eql(calendarToPost.owner.name)
                expect(calendar.owner.email).to.eql(calendarToPost.owner.email)
            })
    })

    it('Should get a calendar', () => {
        return calendarService.getCalendar(calendarId, userId)
            .then(calendar => {
                expect(calendar.name).to.eql(calendarToPost.name)
                expect(calendar.currency).to.eql(calendarToPost.currency)
                expect(calendar.id).to.eql(calendarToPost.id)
                expect(calendar.share).to.eql(calendarToPost.share)
                expect(calendar.single).to.be.a('array')
                expect(calendar.recurrent).to.be.a('array')
                expect(calendar.budget).to.be.a('array')
                expect(calendar.participants).to.be.a('array')
                expect(calendar.owner.ownerId).to.eql(calendarToPost.owner.ownerId)
                expect(calendar.owner.name).to.eql(calendarToPost.owner.name)
                expect(calendar.owner.email).to.eql(calendarToPost.owner.email)
            })
    })

    it('Should get participants', () => {
        return calendarService.getParticipants(userId, calendarId)
            .then(participants => {
                expect(participants).to.be.a('array')
                expect(participants).to.be.eql(calendarToPost.participants)
            })
    })

    it('Should put Share', () => {
        return calendarService.putShare(calendarId, userId)
            .then(calendar => {
                expect(calendar.share).to.equal('Shared')
                expect(calendar.participants).to.be.a('array')
                expect(calendar.participants).to.length(0)
            })
    })

    it('Should post a participant', () => {
        return dbCalendar.postCalendarParticipant(calendarId, participantToPost)
            .then(calendar => {
                expect(calendar.participants[0]).to.be.a('object')
                const participant = calendar.participants[0]
                expect(participant.id).to.eql(participantToPost.id)
                expect(participant.name).to.eql(participantToPost.name)
                expect(participant.email).to.eql(participantToPost.email)
                expect(participant.role).to.eql(participantToPost.role)
            })
    })

    it('Should update role', () => {
        return calendarService.changeRole(calendarId, participantToPost.id, roleToUpdate, userId)
            .then(participant => {
                expect(participant).to.be.a('object')
                expect(participant.id).to.eql(participantToPost.id)
                expect(participant.name).to.eql(participantToPost.name)
                expect(participant.email).to.eql(participantToPost.email)
                expect(participant.role).to.eql(participantToPost.role)
            })
    })

    it('Should post a single item', () => {
        return calendarService.postItem(calendarId, itemSingleToPost, userId)
            .then(item => {
                expect(item).to.be.a('object')
                expect(item.id).to.match(/^[a-zA-Z0-9]{22}$/)
                expect(item.title).to.eql(itemSingleToPost.title)
                expect(item.start.toISOString()).to.eql(itemSingleToPost.start)
                expect(item.value).to.eql(itemSingleToPost.value)
                expect(item.type).to.eql(itemSingleToPost.type)
                expect(item.recurrency).to.eql(itemSingleToPost.recurrency)
                itemSingleId = item.id
                itemSingleToPost.id = item.id
            })
    })

    it('Should update a single item', () => {
        return calendarService.putItem(calendarId, itemSingleId, itemSingleToUpdate, userId)
            .then(item => {
                expect(item).to.be.a('object')
                expect(item.id).to.eql(itemSingleToPost.id)
                expect(item.title).to.eql(itemSingleToPost.title)
                expect(item.start.toISOString()).to.eql(itemSingleToUpdate.start)
                expect(item.value).to.eql(itemSingleToPost.value)
                expect(item.type).to.eql(itemSingleToPost.type)
                expect(item.recurrency).to.eql(itemSingleToPost.recurrency)
            })
    })

    it('Should delete a single item', () => {
        return calendarService.deleteItem(calendarId, itemSingleId, userId)
            .then(item => {
                expect(item).to.be.a('object')
                expect(item.id).to.eql(itemSingleToPost.id)
                expect(item.title).to.eql(itemSingleToPost.title)
                expect(item.start.toISOString()).to.eql(itemSingleToUpdate.start)
                expect(item.value).to.eql(itemSingleToPost.value)
                expect(item.type).to.eql(itemSingleToPost.type)
                expect(item.recurrency).to.eql(itemSingleToPost.recurrency)
            })
    })

    it('Should post a recurrent item', () => {
        return calendarService.postItemRecurrent(calendarId, itemRecurrentToPost, userId)
            .then(item => {
                expect(item).to.be.a('object')
                expect(item.id).to.match(/^[a-zA-Z0-9]{22}$/)
                expect(item.title).to.eql(itemRecurrentToPost.title)
                expect(item.start.toISOString()).to.eql(itemRecurrentToPost.start)
                expect(item.end.toISOString()).to.eql(itemRecurrentToPost.end)
                expect(item.value).to.eql(itemRecurrentToPost.value)
                expect(item.type).to.eql(itemRecurrentToPost.type)
                expect(item.recurrency).to.eql(itemRecurrentToPost.recurrency)
                itemRecurrentId = item.id
                itemRecurrentToPost.id = item.id
            })
    })

    it('Should update a recurrent item', () => {
        return calendarService.putItemRecurrent(calendarId, itemRecurrentId, itemRecurrentToUpdate, userId)
            .then(item => {
                expect(item).to.be.a('object')
                expect(item.id).to.eql(itemRecurrentToPost.id)
                expect(item.title).to.eql(itemRecurrentToPost.title)
                expect(item.start.toISOString()).to.eql(itemRecurrentToUpdate.start)
                expect(item.end.toISOString()).to.eql(itemRecurrentToPost.end)
                expect(item.value).to.eql(itemRecurrentToPost.value)
                expect(item.type).to.eql(itemRecurrentToPost.type)
                expect(item.recurrency).to.eql(itemRecurrentToPost.recurrency)
            })
    })

    it('Should delete a recurrent item', () => {
        return calendarService.deleteItemRecurrent(calendarId, itemRecurrentId, userId)
            .then(item => {
                expect(item).to.be.a('object')
                expect(item.id).to.eql(itemRecurrentToPost.id)
                expect(item.title).to.eql(itemRecurrentToPost.title)
                expect(item.start.toISOString()).to.eql(itemRecurrentToUpdate.start)
                expect(item.end.toISOString()).to.eql(itemRecurrentToPost.end)
                expect(item.value).to.eql(itemRecurrentToPost.value)
                expect(item.type).to.eql(itemRecurrentToPost.type)
                expect(item.recurrency).to.eql(itemRecurrentToPost.recurrency)
            })
    })

    it('Should post a budget', () => {
        return calendarService.postBudget(calendarId, budgetToPost, userId)
            .then(budget => {
                expect(budget).to.be.a('object')
                expect(budget.id).to.match(/^[a-zA-Z0-9]{22}$/)
                expect(budget.date.toISOString()).to.eql(budgetToPost.date)
                expect(budget.value).to.eql(budgetToPost.value)
                expect(budget.period).to.eql(budgetToPost.period)
                budgetId = budget.id
                budgetToPost.id = budget.id
            })
    })

    it('Should update a budget', () => {
        return calendarService.putBudget(calendarId, budgetId, budgetToUpdate, userId)
            .then(budget => {
                expect(budget).to.be.a('object')
                expect(budget.id).to.eql(budgetToPost.id)
                expect(budget.date.toISOString()).to.eql(budgetToPost.date)
                expect(budget.value).to.eql(budgetToUpdate.value)
                expect(budget.period).to.eql(budgetToPost.period)
            })
    })

    it('Should delete a budget', () => {
        return calendarService.deleteBudget(calendarId, budgetId, userId)
            .then(budget => {
                expect(budget).to.be.a('object')
                expect(budget.id).to.eql(budgetToPost.id)
                expect(budget.date.toISOString()).to.eql(budgetToPost.date)
                expect(budget.value).to.eql(budgetToUpdate.value)
                expect(budget.period).to.eql(budgetToPost.period)
            })
    })

    it('Should delete a participant', () => {
        return calendarService.deleteParticipant(calendarId, participantToPost.id, userId)
            .then(participant => {
                expect(participant).to.be.a('object')
                expect(participant.id).to.eql(participantToPost.id)
                expect(participant.name).to.eql(participantToPost.name)
                expect(participant.email).to.eql(participantToPost.email)
                expect(participant.role).to.eql(participantToPost.role)
            })
    })

    it('Should Unshare', () => {
        return calendarService.putUnshare(calendarId, userId)
            .then(calendar => {
                expect(calendar.share).to.equal('Personal')
                expect(calendar.participants).to.be.a('array')
                expect(calendar.participants).to.length(0)
            })
    })

})