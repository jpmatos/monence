const fs = require('fs').promises
const path = require('path')
const error = require('../../object/error')

class DataBaseUserMock {
    constructor() {
        this.readFile(path.join(__dirname, '/mock-data/users.json'))
            .then(res => {
                this.users = res
            })
    }

    static init() {
        return new DataBaseUserMock()
    }

    //TODO
    verifyNewUser(user) {
        const userIdx = this.users.findIndex(usr => usr.id === user.id)
        if (userIdx === -1) {
            this.users.push(user)
            return Promise.resolve('Created new user')
        }
        return Promise.resolve('User already exists')
    }

    getUser(userId) {
        const userIdx = this.users.findIndex(user => user.id === userId)
        if (userIdx === -1)
            return Promise.resolve({'message': `Could not find user ${userIdx}`})

        return Promise.resolve(this.users[userIdx])
    }

    postCalendarToUser(userId, userCalendar) {
        const userIdx = this.users.findIndex(user => user.id === userId)
        if (userIdx === -1)
            return Promise.resolve({'message': `Could not find user ${userIdx}`})

        this.users[userIdx].calendars.push(userCalendar)

        return Promise.resolve(userCalendar)
    }

    getUserByEmail(email) {
        const userIdx = this.users.findIndex(user => user.email === email)
        if (userIdx === -1)
            return Promise.resolve({'error': `Could not find user ${email}`})

        return this.users[userIdx]
    }

    // getUserInvites(userId) {
    //     const userIdx = this.users.findIndex(user => user.id === userId)
    //     if (userIdx === -1)
    //         return Promise.resolve({'message': `Could not find user ${userIdx}`})
    //
    //     const invites = this.users[userIdx].invites
    //     return Promise.resolve(invites)
    // }
    //
    // postInviteToUser(userId, userInvite) {
    //     const userIdx = this.users.findIndex(user => user.id === userId)
    //     if (userIdx === -1)
    //         return Promise.resolve({'message': `Could not find user ${userIdx}`})
    //
    //     this.users[userIdx].invites.push(userInvite)
    //
    //     return Promise.resolve({'message': 'Posted invite to user'})
    // }
    //
    // deleteUserInvite(userId, inviteId) {
    //     const userIdx = this.users.findIndex(user => user.id === userId)
    //     if (userIdx === -1)
    //         return Promise.resolve({'message': `Could not find user ${userIdx}`})
    //
    //     const invite = this.users[userIdx].invites.find(inv => inv.id === inviteId)
    //
    //     this.users[userIdx].invites = this.users[userIdx].invites.filter(inv => inv.id !== inviteId)
    //
    //     return Promise.resolve(invite)
    // }

    deleteCalendarFromUser(calendarId, userId) {
        const userIdx = this.users.findIndex(user => user.id === userId)
        if (userIdx === -1)
            return Promise.resolve({'message': `Could not find user ${userIdx}`})

        this.users[userIdx].invitedCalendars = this.users[userIdx].invitedCalendars.filter(cal => cal.id !== calendarId)

        return Promise.resolve({'message': 'Deleted calendar from user'})
    }

    postParticipating(userId, participating) {
        const userIdx = this.users.findIndex(user => user.id === userId)
        if (userIdx === -1)
            return Promise.resolve({'message': `Could not find user ${userIdx}`})

        this.users[userIdx].participating.push(participating)

        return Promise.resolve(participating)
    }

    deleteParticipating(userId, calendarId) {
        const userIdx = this.users.findIndex(user => user.id === userId)
        if (userIdx === -1)
            return Promise.resolve({'message': `Could not find user ${userIdx}`})

        this.users[userIdx].participating = this.users[userIdx].participating.filter(calendar => calendar.calendarId !== calendarId)

        return Promise.resolve({'message': 'Deleted participating calendar'})
    }

    readFile(filePath) {
        return fs
            .readFile(filePath)
            .then(rawData => {
                return JSON.parse(rawData)
            })
            .catch(err => {
                return {
                    'message': `Could not find mock file in path ${filePath}`,
                    'status': 404,
                    'err': err
                }
            })
    }
}

module.exports = DataBaseUserMock