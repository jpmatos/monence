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

    startTransaction(response, error, transaction) {
        return Promise.resolve(() => {
            return transaction(null)()
        })
            .catch(err => {
                if (!err.isErrorObject)
                    return Promise.reject(error(500, 'Transaction Error'))
                return Promise.reject(err)
            })
            .then(() => {
                return response.body
            })
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
        const user = this.users.find(user => user.id === userId)
        if (!user)
            return Promise.resolve(null)

        const res = Object.assign({}, user)
        this.users = this.users.filter(user => user.id !== userId)

        return Promise.resolve(res)
    }

    getUserByEmail(email) {
        const user = this.users.find(user => user.email === email)
        if (!user)
            return Promise.resolve(null)

        return Promise.resolve(user)
    }

    postCalendarToUser(userId, userCalendar) {
        const user = this.users.find(user => user.id === userId)
        if (!user)
            return Promise.resolve(null)

        user.calendars.push(userCalendar)

        return Promise.resolve({
            "calendars": [userCalendar]
        })
    }

    deleteCalendar(userId, calendarId) {
        const user = this.users.find(user => user.id === userId)
        if (!user)
            return Promise.resolve(null)

        const calendar = user.calendars.find(cal => cal.id === calendarId)
        const res = Object.assign({}, calendar)

        user.calendars = user.calendars.filter(cal => cal.id !== calendarId)

        return Promise.resolve({
            "calendars": [res]
        })
    }

    postParticipating(userId, participating) {
        const user = this.users.find(user => user.id === userId)
        if (!user)
            return Promise.resolve(null)

        user.participating.push(participating)

        return Promise.resolve(
            {
                'participating': [participating]
            }
        )
    }

    deleteParticipating(userId, calendarId) {
        const user = this.users.find(user => user.id === userId)
        if (!user)
            return Promise.resolve(null)

        const participating = user.participating.find(calendar => calendar.calendarId === calendarId)
        const res = Object.assign({}, participating)

        user.participating = user.participating.filter(calendar => calendar.calendarId !== calendarId)

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