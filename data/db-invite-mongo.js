const MongoClient = require('mongodb').MongoClient

class DataBaseInviteMongo {

    constructor(connectionString) {
        this.connect = MongoClient.connect(connectionString,
            {useUnifiedTopology: true})
            .then(client => {
                this.client = client
                this.db = client.db('monenceDB')
            })
    }

    static init(connectionString) {
        return new DataBaseInviteMongo(connectionString)
    }

    isConnected() {
        return this.connect
    }

    startTransaction(response, error, transaction) {
        const session = this.client.startSession()
        return session.withTransaction(transaction(session))
            .catch(err => {
                if (!err.isErrorObject)
                    return Promise.reject(error(500, 'Transaction Error'))
                return Promise.reject(err)
            })
            .then(res => {
                if (!res)
                    return Promise.reject(error(500, 'Transaction Aborted'))
                return response.body
            })
            .finally(() => {
                return session.endSession()
            })
    }

    getPending(userId, session) {
        return this.db.collection('invites')
            .find(
                {
                    inviteeId: userId
                },
                {
                    session: session,
                    projection:
                        {
                            _id: 0
                        }
                }
            ).toArray()
    }

    getSent(calendarId, session) {
        return this.db.collection('invites')
            .find(
                {
                    calendarId: calendarId
                },
                {
                    session: session,
                    projection:
                        {
                            _id: 0
                        }
                }
            ).toArray()
    }

    postInvite(invite, session) {
        return this.db.collection('invites')
            .insertOne(invite, {session: session})
            .then(result => {
                if (result.ops.length === 0)
                    return null
                else
                    return result.ops[0]
            })
    }

    getInviteeId(inviteId, session) {
        return this.db.collection('invites')
            .findOne(
                {
                    id: inviteId
                },
                {
                    session: session,
                    projection: {
                        _id: 0,
                        inviteeId: 1
                    }
                }
            )
    }

    getInviterId(inviteId, session) {
        return this.db.collection('invites')
            .findOne(
                {
                    id: inviteId
                },
                {
                    session: session,
                    projection: {
                        _id: 0,
                        inviterId: 1
                    }
                }
            )
    }

    deleteInvite(inviteId, session) {
        return this.db.collection('invites')
            .findOneAndDelete(
                {
                    id: inviteId
                },
                {
                    session: session,
                    projection:
                        {
                            _id: 0
                        }
                }
            )
            .then(result => {
                return result.value
            })
    }
}

module.exports = DataBaseInviteMongo