const expect = require('chai').expect
const path = require('path')
const dotenv = require('dotenv');
dotenv.config({path: path.resolve(__dirname, '../.env')});

//See if mock API is set
const mongoConnection = require('../data/mongo-connection').init(process.env.CONNECTION_STRING, process.env.MONGO_INDEX)

let dbUser
if (process.env.MOCK_USER_DB === 'true')
    dbUser = require('../data/mock/db-user-mock').init()
else
    dbUser = require('../data/db-user-mongo').init(mongoConnection)

describe('Monence tests for user database', () => {

    const userId = 'testuserid123'
    const userToPost = {
        'id': userId,
        'name': 'Test User',
        'email': 'test.user@gmail.com',
        'photos': 'testphoto.png',
        'calendars': [],
        'participating': []
    }
    const calendarId = 'testcalendarid123'
    const calendarToPost = {
        'id': calendarId,
        'name': 'Test Calendar'
    }
    const participatingToPost = {
        'calendarId': calendarId,
        'calendarName': calendarToPost.name,
        'role': 'Viewer'
    }

    before(() => {
        return dbUser.isConnected()
    })

    after(() => {
        return dbUser.deleteUser(userId)
            .then(user => {
                expect(user.id).to.be.eql(userToPost.id)
                expect(user.name).to.be.eql(userToPost.name)
                expect(user.email).to.be.eql(userToPost.email)
                expect(user.photos).to.be.eql(userToPost.photos)
                expect(user.calendars).to.be.a('array')
                expect(user.participating).to.be.a('array')
            })
    })

    it('Should create a new user', () => {
        return dbUser.createNewUser(userToPost)
            .then(user => {
                expect(user.id).to.be.eql(userToPost.id)
                expect(user.name).to.be.eql(userToPost.name)
                expect(user.email).to.be.eql(userToPost.email)
                expect(user.photos).to.be.eql(userToPost.photos)
                expect(user.calendars).to.be.a('array')
                expect(user.participating).to.be.a('array')
            })
    })

    it('Should get a user', () => {
        return dbUser.getUser(userId)
            .then(user => {
                expect(user.id).to.be.eql(userToPost.id)
                expect(user.name).to.be.eql(userToPost.name)
                expect(user.email).to.be.eql(userToPost.email)
                expect(user.photos).to.be.eql(userToPost.photos)
                expect(user.calendars).to.be.a('array')
                expect(user.participating).to.be.a('array')
            })
    })

    it('Should get user by email', () => {
        return dbUser.getUserByEmail(userToPost.email)
            .then(user => {
                expect(user.id).to.be.eql(userToPost.id)
                expect(user.name).to.be.eql(userToPost.name)
                expect(user.email).to.be.eql(userToPost.email)
                expect(user.photos).to.be.eql(userToPost.photos)
                expect(user.calendars).to.be.a('array')
                expect(user.participating).to.be.a('array')
            })
    })

    it('Should post calendar to user', () => {
        return dbUser.postCalendarToUser(userId, calendarToPost)
            .then(user => {
                expect(user.calendars[0]).to.be.a('object')

                const calendar = user.calendars[0]
                expect(calendar.id).to.be.eql(calendarToPost.id)
                expect(calendar.name).to.be.eql(calendarToPost.name)
            })
    })

    it('Should post participating to user', () => {
        return dbUser.postParticipating(userId, participatingToPost)
            .then(user => {
                expect(user.participating[0]).to.be.a('object')

                const participating = user.participating[0]
                expect(participating.calendarId).to.be.eql(participatingToPost.calendarId)
                expect(participating.calendarName).to.be.eql(participatingToPost.calendarName)
                expect(participating.role).to.be.eql(participatingToPost.role)
            })
    })

    it('Should delete participating', () => {
        return dbUser.deleteParticipating(userId, calendarId)
            .then(user => {
                expect(user.participating[0]).to.be.a('object')

                const participating = user.participating[0]
                expect(participating.calendarId).to.be.eql(participatingToPost.calendarId)
                expect(participating.calendarName).to.be.eql(participatingToPost.calendarName)
                expect(participating.role).to.be.eql(participatingToPost.role)
            })
    })
})