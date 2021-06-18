const fs = require('fs').promises
const path = require('path')

class DataBaseUserMock {
    constructor() {
        this.read = this.readFile(path.join(__dirname, '/mock-data/users.json'))
            .then(res => {
                this.users = res
            })
    }

    static init() {
        return new DataBaseUserMock()
    }

    isConnected() {
        return this.read
    }

    getUser(userId) {
        const userIdx = this.users.findIndex(user => user.id === userId)
        if (userIdx === -1)
            return Promise.resolve(null)

        return Promise.resolve(this.users[userIdx])
    }

    createNewUser(user) {
        this.users.push(user)

        return Promise.resolve(user)
    }

    deleteUser(userId) {
        const userIdx = this.users.findIndex(user => user.id === userId)
        if (userIdx === -1)
            return Promise.resolve(null)

        const res = Object.assign({}, this.users[userIdx])
        this.users = this.users.filter(user => user.id !== userId)

        return Promise.resolve(res)
    }

    getUserByEmail(email) {
        const userIdx = this.users.findIndex(user => user.email === email)
        if (userIdx === -1)
            return Promise.resolve(null)

        return Promise.resolve(this.users[userIdx])
    }

    postCalendarToUser(userId, userCalendar) {
        const userIdx = this.users.findIndex(user => user.id === userId)
        if (userIdx === -1)
            return Promise.resolve(null)

        this.users[userIdx].calendars.push(userCalendar)

        return Promise.resolve({
            "calendars": [userCalendar]
        })
    }

    postParticipating(userId, participating) {
        const userIdx = this.users.findIndex(user => user.id === userId)
        if (userIdx === -1)
            return Promise.resolve(null)

        this.users[userIdx].participating.push(participating)

        return Promise.resolve(
            {
                'participating': [participating]
            }
        )
    }

    deleteParticipating(userId, calendarId) {
        const userIdx = this.users.findIndex(user => user.id === userId)
        if (userIdx === -1)
            return Promise.resolve(null)

        const participatingIdx = this.users[userIdx].participating.findIndex(calendar => calendar.calendarId === calendarId)
        const res = Object.assign({}, this.users[userIdx].participating[participatingIdx])

        this.users[userIdx].participating = this.users[userIdx].participating.filter(calendar => calendar.calendarId !== calendarId)

        return Promise.resolve({
            'participating': [res]
        })
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