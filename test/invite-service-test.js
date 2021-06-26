const expect = require('chai').expect
const path = require('path')
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const socketManager = require('../service/sockets/socket-manager').init()

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

const inviteService = require('../service/invite-service').init(dbCalendar, dbUser, dbInvite, socketManager)

describe('Monence tests for invite service', () => {

    let inviteId = 'testinviteid1230000000'
    const inviteToPost = {
        'id': inviteId,
        'calendarId': 'testcalendarid12300000',
        'email': 'test.invitee.user@gmail.com',
        'role': 'Viewer',
        'inviteeId': 'testuserid124',
        'inviterId': 'testuserid123',
        'calendarName': 'TestCalendar',
        'inviterName': 'Test Inviter User',
        'inviteeName': 'Test Invitee User',
        'inviteeEmail': 'test.invitee.user@gmail.com'

    }

    const inviteeUserId = 'testuserid124'
    const inviteeUser = {
        'id': inviteeUserId,
        'name': 'Test Invitee User',
        'email': 'test.invitee.user@gmail.com',
        'photos': 'testphoto.png',
        'calendars': [],
        'participating': []
    }

    const inviterUserId = 'testuserid123'
    const inviterUser = {
        'id': inviterUserId,
        'name': 'Test Inviter User',
        'email': 'test.inviter.user@gmail.com',
        'photos': 'testphoto.png',
        'calendars': [],
        'participating': []
    }

    let calendarId = 'testcalendarid12300000'
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
            "ownerId": inviterUserId,
            "name": "Test Inviter User",
            "email": "test.inviter.user@gmail.com"
        }
    }

    before(() => {
        return dbUser.isConnected()
            .then(() => {
                return dbCalendar.isConnected()
                    .then(() => {
                        return dbUser.createNewUser(inviteeUser)
                            .then(() => {
                                return dbUser.createNewUser(inviterUser)
                                    .then(() => {
                                        return dbCalendar.postCalendar(calendarToPost)
                                    })
                            })
                    })
            })
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
                return dbUser.deleteUser(inviterUserId).then(() => {
                    return dbUser.deleteUser(inviteeUserId)
                })
            })
    })

    it('Should post invite', () => {
        return inviteService.postInvite(inviterUserId, inviteToPost)
            .then(invite => {
                expect(invite.id).to.be.match(/^[a-zA-Z0-9]{22}$/)
                expect(invite.calendarId).to.be.eql(inviteToPost.calendarId)
                expect(invite.inviteeId).to.be.eql(inviteToPost.inviteeId)
                expect(invite.inviterId).to.be.eql(inviteToPost.inviterId)
                expect(invite.calendarName).to.be.eql(inviteToPost.calendarName)
                expect(invite.inviterName).to.be.eql(inviteToPost.inviterName)
                expect(invite.inviteeName).to.be.eql(inviteToPost.inviteeName)
                expect(invite.inviteeEmail).to.be.eql(inviteToPost.inviteeEmail)
                inviteId = invite.id
                inviteToPost.id = invite.id
            })
    })

    it('Should get Pending', () => {
        return inviteService.getPending(inviteeUserId)
            .then(invites => {
                expect(invites).to.be.a('array')

                const invite = invites[0]
                expect(invite.id).to.be.match(/^[a-zA-Z0-9]{22}$/)
                expect(invite.calendarId).to.be.eql(inviteToPost.calendarId)
                expect(invite.inviteeId).to.be.eql(inviteToPost.inviteeId)
                expect(invite.inviterId).to.be.eql(inviteToPost.inviterId)
                expect(invite.calendarName).to.be.eql(inviteToPost.calendarName)
                expect(invite.inviterName).to.be.eql(inviteToPost.inviterName)
                expect(invite.inviteeName).to.be.eql(inviteToPost.inviteeName)
                expect(invite.inviteeEmail).to.be.eql(inviteToPost.inviteeEmail)
            })
    })

    it('Should get sent invites', () => {
        return inviteService.getSent(inviterUserId, inviteToPost.calendarId)
            .then(invites => {
                expect(invites).to.be.an('array')

                const invite = invites[0]
                expect(invite.id).to.be.eql(inviteToPost.id)
                expect(invite.calendarId).to.be.eql(inviteToPost.calendarId)
                expect(invite.inviteeId).to.be.eql(inviteToPost.inviteeId)
                expect(invite.inviterId).to.be.eql(inviteToPost.inviterId)
                expect(invite.calendarName).to.be.eql(inviteToPost.calendarName)
                expect(invite.inviterName).to.be.eql(inviteToPost.inviterName)
                expect(invite.inviteeName).to.be.eql(inviteToPost.inviteeName)
                expect(invite.inviteeEmail).to.be.eql(inviteToPost.inviteeEmail)
            })
    })

    it('Should accept invite', () => {
        return inviteService.acceptInvite(inviteeUserId, inviteId)
            .then(participants => {
                expect(participants).to.be.an('object')
                expect(participants.calendarId).to.be.eql(calendarId)
                expect(participants.calendarName).to.be.eql(calendarToPost.name)
                expect(participants.role).to.be.eql(inviteToPost.role)
            })
    })

    it('Should post invite', () => {
        return inviteService.postInvite(inviterUserId, inviteToPost)
            .then(invite => {
                expect(invite.id).to.be.match(/^[a-zA-Z0-9]{22}$/)
                expect(invite.calendarId).to.be.eql(inviteToPost.calendarId)
                expect(invite.inviteeId).to.be.eql(inviteToPost.inviteeId)
                expect(invite.inviterId).to.be.eql(inviteToPost.inviterId)
                expect(invite.calendarName).to.be.eql(inviteToPost.calendarName)
                expect(invite.inviterName).to.be.eql(inviteToPost.inviterName)
                expect(invite.inviteeName).to.be.eql(inviteToPost.inviteeName)
                expect(invite.inviteeEmail).to.be.eql(inviteToPost.inviteeEmail)
                inviteId = invite.id
                inviteToPost.id = invite.id
            })
    })

    it('Should delete invite', () => {
        return inviteService.deleteInvite(inviterUserId, inviteId)
            .then(invite => {
                expect(invite.id).to.be.match(/^[a-zA-Z0-9]{22}$/)
                expect(invite.calendarId).to.be.eql(inviteToPost.calendarId)
                expect(invite.inviteeId).to.be.eql(inviteToPost.inviteeId)
                expect(invite.inviterId).to.be.eql(inviteToPost.inviterId)
                expect(invite.calendarName).to.be.eql(inviteToPost.calendarName)
                expect(invite.inviterName).to.be.eql(inviteToPost.inviterName)
                expect(invite.inviteeName).to.be.eql(inviteToPost.inviteeName)
                expect(invite.inviteeEmail).to.be.eql(inviteToPost.inviteeEmail)
            })
    })

    it('Should post invite', () => {
        return inviteService.postInvite(inviterUserId, inviteToPost)
            .then(invite => {
                expect(invite.id).to.be.match(/^[a-zA-Z0-9]{22}$/)
                expect(invite.calendarId).to.be.eql(inviteToPost.calendarId)
                expect(invite.inviteeId).to.be.eql(inviteToPost.inviteeId)
                expect(invite.inviterId).to.be.eql(inviteToPost.inviterId)
                expect(invite.calendarName).to.be.eql(inviteToPost.calendarName)
                expect(invite.inviterName).to.be.eql(inviteToPost.inviterName)
                expect(invite.inviteeName).to.be.eql(inviteToPost.inviteeName)
                expect(invite.inviteeEmail).to.be.eql(inviteToPost.inviteeEmail)
                inviteId = invite.id
                inviteToPost.id = invite.id
            })
    })

    it('Should decline invite', () => {
        return inviteService.declineInvite(inviteeUserId, inviteId)
            .then(invite => {
                expect(invite.id).to.be.match(/^[a-zA-Z0-9]{22}$/)
                expect(invite.calendarId).to.be.eql(inviteToPost.calendarId)
                expect(invite.inviteeId).to.be.eql(inviteToPost.inviteeId)
                expect(invite.inviterId).to.be.eql(inviteToPost.inviterId)
                expect(invite.calendarName).to.be.eql(inviteToPost.calendarName)
                expect(invite.inviterName).to.be.eql(inviteToPost.inviterName)
                expect(invite.inviteeName).to.be.eql(inviteToPost.inviteeName)
                expect(invite.inviteeEmail).to.be.eql(inviteToPost.inviteeEmail)
            })
    })
})