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

    postInvite(invite) {
        return this.db.collection('invites')
            .insertOne({invite})
            .then(result => {
                if (result.insertedCount !== 1) {
                    return {'message': `Could not insert invite`}
                } else {
                    return invite
                }
            })
    }

    getPending(userId) {
        return this.db.collection('invites')
            .find({inviteeId: userId}, {projection: {_id: 0}}).toArray()
            .then(result => {
                if (result === null) {
                    return {'message': `Could not find invites`}
                } else {
                    return result
                }
            })
    }

    getSent(calendarId) {
        return this.db.collection('invites')
            .find({calendarId: calendarId}, {projection: {_id: 0}}).toArray()
            .then(result => {
                if (result === null) {
                    return {'message': `Could not find invites`}
                } else {
                    return result
                }
            })
    }

    deleteInvite(inviteId) {
        return this.db.collection('invites')
            .findOneAndDelete({id: inviteId})
            .then(result => {
                if (result === null) {
                    return {'message': `Could not find invites`}
                } else {
                    return result
                }
            })
    }
}