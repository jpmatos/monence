const MongoClient = require('mongodb').MongoClient

class DataBaseInviteMongo {

    constructor(connectionString) {
        MongoClient.connect(connectionString,
            {useUnifiedTopology: true})
            .then(client => {
                this.db = client.db('monenceDB')
            })
    }

    static init(connectionString) {
        return new DataBaseInviteMongo(connectionString)
    }

    //TODO Mock
    postInvite(invite) {
        return this.db.collection('invites')
            .insertOne(invite)
            .then(result => {
                if (result.ops.length === 0)
                    return null
                else
                    return result.ops[0]
            })
    }

    //TODO Mock
    getPending(userId) {
        return this.db.collection('invites')
            .find(
                {
                    inviteeId: userId
                },
                {
                    projection:
                        {
                            _id: 0
                        }
                }
            ).toArray()
    }

    //TODO Mock
    getSent(calendarId) {
        return this.db.collection('invites')
            .find(
                {
                    calendarId: calendarId
                },
                {
                    projection:
                        {
                            _id: 0
                        }
                }
            ).toArray()
    }

    //TODO Mock
    deleteInvite(inviteId) {
        return this.db.collection('invites')
            .findOneAndDelete(
                {
                    id: inviteId
                },
                {
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