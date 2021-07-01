const fs = require('fs').promises
const path = require('path')

class DataBaseInviteMock {
    constructor() {
        this.read = this.readFile(path.join(__dirname, './mock-data/invites.json'))
            .then(res => {
                this.invites = res
            })
    }

    static init() {
        return new DataBaseInviteMock()
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

    getPending(userId) {
        const invites = this.invites.filter(inv => inv.inviteeId === userId)

        return Promise.resolve(invites)
    }

    getSent(calendarId) {
        const invites = this.invites.filter(inv => inv.calendarId === calendarId)

        return Promise.resolve(invites)
    }

    postInvite(invite) {
        this.invites.push(invite)

        return Promise.resolve(invite)
    }

    getInviteeId(inviteId) {
        const invite = this.invites.find(invite => invite.id === inviteId)
        if(!invite)
            return null

        return Promise.resolve({
            'inviteeId': invite.inviteeId
        })
    }

    getInviterId(inviteId) {
        const invite = this.invites.find(invite => invite.id === inviteId)
        if(!invite)
            return null

        return Promise.resolve({
            'inviterId': invite.inviterId
        })
    }

    deleteInvite(inviteId) {
        const invite = this.invites.find(invite => invite.id === inviteId)
        if(!invite)
            return null

        const res = Object.assign({}, invite)

        this.invites = this.invites.filter(invite => invite.id !== inviteId)

        return Promise.resolve(res)
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