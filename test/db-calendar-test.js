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

describe('Monence tests for calendar database', () => {
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

    it('Should create a calendar', () => {
        return dbCalendar.postCalendar(calendarToPost)
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

    it('Should get calendar', () => {
        return dbCalendar.getCalendar(calendarId)
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

    it('Should get calendar owner', () => {
        return dbCalendar.getCalendarOwner(calendarId)
            .then(calendar => {
                expect(calendar.owner.ownerId).to.eql(calendarToPost.owner.ownerId)
                expect(calendar.owner.name).to.eql(calendarToPost.owner.name)
                expect(calendar.owner.email).to.eql(calendarToPost.owner.email)
            })
    })

    it('Should get calendar owner and participants', () => {
        return dbCalendar.getCalendarOwnerAndParticipant(calendarId, userId)
            .then(calendar => {
                expect(calendar.participants).to.be.a('array')
                expect(calendar.owner.ownerId).to.eql(calendarToPost.owner.ownerId)
                expect(calendar.owner.name).to.eql(calendarToPost.owner.name)
                expect(calendar.owner.email).to.eql(calendarToPost.owner.email)
            })
    })

    it('Should get calendar owner and name', () => {
        return dbCalendar.getCalendarOwnerAndName(calendarId)
            .then(calendar => {
                expect(calendar.name).to.eql(calendarToPost.name)
                expect(calendar.owner.ownerId).to.eql(calendarToPost.owner.ownerId)
                expect(calendar.owner.name).to.eql(calendarToPost.owner.name)
                expect(calendar.owner.email).to.eql(calendarToPost.owner.email)
            })
    })

    it('Should post a single item', () => {
        return dbCalendar.postItemSingle(calendarId, itemSingleToPost)
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

    it('Should post a recurrent item', () => {
        return dbCalendar.postItemRecurrent(calendarId, itemRecurrentToPost)
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

    it('Should update a single item', () => {
        return dbCalendar.putItemSingle(calendarId, itemSingleId, itemSingleToUpdate)
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

    it('Should update a recurrent item', () => {
        return dbCalendar.putItemRecurrent(calendarId, itemRecurrentId, itemRecurrentToUpdate)
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

    it('Should delete a single item', () => {
        return dbCalendar.deleteItemSingle(calendarId, itemSingleId)
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

    it('Should delete a recurrent item', () => {
        return dbCalendar.deleteItemRecurrent(calendarId, itemRecurrentId)
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
        return dbCalendar.postBudget(calendarId, budgetToPost)
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
        return dbCalendar.putBudget(calendarId, budgetId, budgetToUpdate)
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
        return dbCalendar.deleteBudget(calendarId, budgetId)
            .then(calendar => {
                expect(calendar.budget[0]).to.be.a('object')

                const budget = calendar.budget[0]
                expect(budget.id).to.eql(budgetToPost.id)
                expect(budget.date).to.eql(budgetToPost.date)
                expect(budget.value).to.eql(budgetToUpdate.value)
                expect(budget.period).to.eql(budgetToPost.period)
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

    it('Should get participants', () => {
        return dbCalendar.getParticipants(calendarId)
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
        return dbCalendar.putRole(calendarId, participantToPost.id, roleToUpdate)
            .then(calendar => {
                expect(calendar.participants[0]).to.be.a('object')

                const participant = calendar.participants[0]
                expect(participant.id).to.eql(participantToPost.id)
                expect(participant.name).to.eql(participantToPost.name)
                expect(participant.email).to.eql(participantToPost.email)
                expect(participant.role).to.eql(participantToPost.role)
            })
    })

    it('Should delete a participant', () => {
        return dbCalendar.deleteParticipant(calendarId, participantToPost.id)
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