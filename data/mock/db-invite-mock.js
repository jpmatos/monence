const fs = require('fs').promises
const path = require('path')

class DataBaseInviteMock {
    constructor() {
        this.readFile(path.join(__dirname, './mock-data/invites.json'))
            .then(res => {
                this.invites = res
            })
    }

    static init() {
        return new DataBaseInviteMock()
    }

    postInvite(invite) {
        this.invites.push(invite)
        return Promise.resolve(invite)
    }

    getPending(userId) {
        const invites = this.invites.filter(inv => inv.inviteeId === userId)
        return Promise.resolve(invites)
    }

    getSent(calendarId) {
        const invites = this.invites.filter(inv => inv.calendarId === calendarId)
        return Promise.resolve(invites)
    }

    deleteInvite(inviteId) {
        const invite = this.invites.find(invite => invite.id === inviteId)

        this.invites = this.invites.filter(invite => invite.id !== inviteId)

        return Promise.resolve(invite)
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

module.exports = DataBaseInviteMock