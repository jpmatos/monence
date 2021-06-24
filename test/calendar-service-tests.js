const expect = require('chai').expect

//Load env variables
const env = require('../env.json')
Object.assign(process.env, env)

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

let calendarService = require('../service/calendar-service').init(dbCalendar, dbUser, dbExchanges)

describe('Monence tests for calendar service', () => {
    const userId = 'testuserid123'
    const calendarId = 'testcalendarid123'
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
    const itemSingleId = "testitemsingleid123"
    const itemSingleToPost = {
        "id": itemSingleId,
        "title": "Test Single Item",
        "start": "2021-05-14T00:00:00.000Z",
        "value": 20.55,
        "type": "expense",
        "recurrency": "single"
    }
    const itemRecurrentId = "testitemrecurrentid123"
    const itemRecurrentToPost = {
        "id": itemRecurrentId,
        "title": "Test Recurrent Item",
        "start": "2021-05-14T00:00:00.000Z",
        "end": "2021-05-21T00:00:00.000Z",
        "value": 20.55,
        "type": "expense",
        "recurrency": "recurrent"
    }
    const itemSingleToUpdate = {
        "start": "2021-05-16T00:00:00.000Z"
    }
    const itemRecurrentToUpdate = {
        "start": "2021-05-16T00:00:00.000Z"
    }
    const budgetId = "testbudgetid123"
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
        'id': 'testuserid124',
        'name': 'Test User 2',
        'email': 'test.user2@gmail.com',
        'role': 'Viewer'
    }
    const roleToUpdate = 'Viewer'

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

    it('Should update role', () => {
        return calendarService.changeRole(calendarId, participantToPost.id, roleToUpdate, userId)
            .then(calendar => {
                expect(calendar.participants[0]).to.be.a('object')

                const participant = calendar.participants[0]
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

    it('Should post a single item', () => {
        return calendarService.postItem(calendarId, itemSingleToPost, userId)
            .then(calendar => {
                expect(calendar.single[0]).to.be.a('object')

                const item = calendar.single[0]
                expect(item.id).to.eql(itemSingleToPost.id)
                expect(item.title).to.eql(itemSingleToPost.title)
                expect(item.start).to.eql(itemSingleToPost.start)
                expect(item.value).to.eql(itemSingleToPost.value)
                expect(item.type).to.eql(itemSingleToPost.type)
                expect(item.recurrency).to.eql(itemSingleToPost.recurrency)
            })
    })

    it('Should update a single item', () => {
        return calendarService.putItem(calendarId, itemSingleId, itemSingleToUpdate, userId)
            .then(calendar => {
                expect(calendar.single[0]).to.be.a('object')

                const item = calendar.single[0]
                expect(item.id).to.eql(itemSingleToPost.id)
                expect(item.title).to.eql(itemSingleToPost.title)
                expect(item.start).to.eql(itemSingleToUpdate.start)
                expect(item.value).to.eql(itemSingleToPost.value)
                expect(item.type).to.eql(itemSingleToPost.type)
                expect(item.recurrency).to.eql(itemSingleToPost.recurrency)
            })
    })

    it('Should delete a single item', () => {
        return calendarService.deleteItem(calendarId, itemSingleId, userId)
            .then(calendar => {
                expect(calendar.single[0]).to.be.a('object')

                const item = calendar.single[0]
                expect(item.id).to.eql(itemSingleToPost.id)
                expect(item.title).to.eql(itemSingleToPost.title)
                expect(item.start).to.eql(itemSingleToUpdate.start)
                expect(item.value).to.eql(itemSingleToPost.value)
                expect(item.type).to.eql(itemSingleToPost.type)
                expect(item.recurrency).to.eql(itemSingleToPost.recurrency)
            })
    })

    it('Should post a recurrent item', () => {
        return calendarService.postItemRecurrent(calendarId, itemRecurrentToPost, userId)
            .then(calendar => {
                expect(calendar.recurrent[0]).to.be.a('object')

                const item = calendar.recurrent[0]
                expect(item.id).to.eql(itemRecurrentToPost.id)
                expect(item.title).to.eql(itemRecurrentToPost.title)
                expect(item.start).to.eql(itemRecurrentToPost.start)
                expect(item.end).to.eql(itemRecurrentToPost.end)
                expect(item.value).to.eql(itemRecurrentToPost.value)
                expect(item.type).to.eql(itemRecurrentToPost.type)
                expect(item.recurrency).to.eql(itemRecurrentToPost.recurrency)
            })
    })

    it('Should update a recurrent item', () => {
        return calendarService.putItemRecurrent(calendarId, itemRecurrentId, itemRecurrentToUpdate, userId)
            .then(calendar => {
                expect(calendar.recurrent[0]).to.be.a('object')

                const item = calendar.recurrent[0]
                expect(item.id).to.eql(itemRecurrentToPost.id)
                expect(item.title).to.eql(itemRecurrentToPost.title)
                expect(item.start).to.eql(itemRecurrentToUpdate.start)
                expect(item.end).to.eql(itemRecurrentToPost.end)
                expect(item.value).to.eql(itemRecurrentToPost.value)
                expect(item.type).to.eql(itemRecurrentToPost.type)
                expect(item.recurrency).to.eql(itemRecurrentToPost.recurrency)
            })
    })

    it('Should delete a recurrent item', () => {
        return calendarService.deleteItemRecurrent(calendarId, itemRecurrentId, userId)
            .then(calendar => {
                expect(calendar.recurrent[0]).to.be.a('object')

                const item = calendar.recurrent[0]
                expect(item.id).to.eql(itemRecurrentToPost.id)
                expect(item.title).to.eql(itemRecurrentToPost.title)
                expect(item.start).to.eql(itemRecurrentToUpdate.start)
                expect(item.end).to.eql(itemRecurrentToPost.end)
                expect(item.value).to.eql(itemRecurrentToPost.value)
                expect(item.type).to.eql(itemRecurrentToPost.type)
                expect(item.recurrency).to.eql(itemRecurrentToPost.recurrency)
            })
    })

    it('Should post a budget', () => {
        return calendarService.postBudget(calendarId, budgetToPost, userId)
            .then(calendar => {
                expect(calendar.budget[0]).to.be.a('object')

                const budget = calendar.budget[0]
                expect(budget.id).to.eql(budgetToPost.id)
                expect(budget.date).to.eql(budgetToPost.date)
                expect(budget.value).to.eql(budgetToPost.value)
                expect(budget.period).to.eql(budgetToPost.period)
            })
    })

    it('Should update a budget', () => {
        return calendarService.putBudget(calendarId, budgetId, budgetToUpdate, userId)
            .then(calendar => {
                expect(calendar.budget[0]).to.be.a('object')

                const budget = calendar.budget[0]
                expect(budget.id).to.eql(budgetToPost.id)
                expect(budget.date).to.eql(budgetToPost.date)
                expect(budget.value).to.eql(budgetToUpdate.value)
                expect(budget.period).to.eql(budgetToPost.period)
            })
    })

    it('Should delete a budget', () => {
        return calendarService.deleteBudget(calendarId, budgetId, userId)
            .then(calendar => {
                expect(calendar.budget[0]).to.be.a('object')

                const budget = calendar.budget[0]
                expect(budget.id).to.eql(budgetToPost.id)
                expect(budget.date).to.eql(budgetToPost.date)
                expect(budget.value).to.eql(budgetToUpdate.value)
                expect(budget.period).to.eql(budgetToPost.period)
            })
    })

    it('Should delete a participant', () => {
        return calendarService.deleteParticipant(calendarId, participantToPost.id, userId)
            .then(calendar => {
                expect(calendar.participants[0]).to.be.a('object')

                const participant = calendar.participants[0]
                expect(participant.id).to.eql(participantToPost.id)
                expect(participant.name).to.eql(participantToPost.name)
                expect(participant.email).to.eql(participantToPost.email)
                expect(participant.role).to.eql(participantToPost.role)
            })
    })

})