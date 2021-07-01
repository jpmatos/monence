const expect = require('chai').expect
const path = require('path')
const dotenv = require('dotenv');
dotenv.config({path: path.resolve(__dirname, '../.env')});

//See if mock API is set
const mongoConnection = require('../data/mongo-connection').init(process.env.CONNECTION_STRING, process.env.MONGO_INDEX)

let dbCalendar
if (process.env.MOCK_CALENDAR_DB === 'true')
    dbCalendar = require('../data/mock/db-calendar-mock').init()
else
    dbCalendar = require('../data/db-calendar-mongo').init(mongoConnection)

let dbUser
if (process.env.MOCK_USER_DB === 'true')
    dbUser = require('../data/mock/db-user-mock').init()
else
    dbUser = require('../data/db-user-mongo').init(mongoConnection)

let userService = require('../service/user-service').init(dbCalendar, dbUser)

describe('Monence tests for user service', () => {

    const userId = 'testuserid123'
    const userToPost = {
        'id': userId,
        'name': 'Test User',
        'email': 'test.user@gmail.com',
        'photos': 'testphoto.png',
        'calendars': [],
        'participating': []
    }
    let calendarId = 'testcalendarid123'
    const calendarToPost = {
        'id': calendarId,
        'name': 'Test Calendar',
        'currency': 'EUR'
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

                return dbCalendar.deleteCalendar(calendarId)
            })
    })

    it('Should verify a new user', () => {
        return userService.verifyNewUser(userId, userToPost.name, userToPost.email, userToPost.photos)
            .then(result => {
                expect(result.message).to.be.equal('Created user')
            })
    })

    it('Should get a user', () => {
        return userService.getUser(userId)
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
        return userService.postCalendar(userId, calendarToPost)
            .then(calendar => {
                expect(calendar).to.be.a('object')
                expect(calendar.id).to.be.match(/^[a-zA-Z0-9]{22}$/)
                expect(calendar.name).to.be.eql(calendarToPost.name)
                calendarId = calendar.id
                calendarToPost.id = calendar.id
            })
    })

})