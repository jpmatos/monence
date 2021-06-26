const expect = require('chai').expect
const path = require('path')
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

//See if mock API is set
let dbInvite
if(process.env.MOCK_INVITE_DB === 'true')
    dbInvite = require('../data/mock/db-invite-mock').init()
else
    dbInvite = require('../data/db-invite-mongo').init(process.env.CONNECTION_STRING)

describe('Monence tests for invite database', () => {

    const inviteId = 'testinviteid123'
    const inviteToPost = {
        'id': inviteId,
        'calendarId': 'testcalendarid123',
        'inviteeId': 'testuserid124',
        'inviterId': 'testuserid123',
        'calendarName': 'Test Calendar',
        'inviterName': 'Test User 1',
        'inviteeName': 'Test User 2',
        'inviteeEmail': 'test.user2@gmail.com'
    }

    before(() => {
        return dbInvite.isConnected()
    })

    after(() => {
        return dbInvite.deleteInvite(inviteId)
            .then(invite => {
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

    it('Should post invite', () => {
        return dbInvite.postInvite(inviteToPost)
            .then(invite => {
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

    it('Should get invitee ID', () => {
        return dbInvite.getInviteeId(inviteId)
            .then(invite => {
                expect(invite.inviteeId).to.be.eql(inviteToPost.inviteeId)
            })
    })

    it('Should get inviter ID', () => {
        return dbInvite.getInviterId(inviteId)
            .then(invite => {
                expect(invite.inviterId).to.be.eql(inviteToPost.inviterId)
            })
    })

    it('Should get pending invites', () => {
        return dbInvite.getPending(inviteToPost.inviteeId)
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

    it('Should get sent invites', () => {
        return dbInvite.getSent(inviteToPost.calendarId)
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
});