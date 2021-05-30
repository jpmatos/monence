const MongoClient = require('mongodb').MongoClient
const error = require('../object/error')

class DataBaseUserMongo {
    constructor(connectionString) {
        MongoClient.connect(connectionString,
            {useUnifiedTopology: true})
            .then(client => {
                this.db = client.db('monenceDB')
            })
    }

    static init(connectionString) {
        return new DataBaseUserMongo(connectionString)
    }

    verifyNewUser(user) {
        return this.db.collection('users')
            .insertOne(user)
            .then(result => {
                // check if update succeeded
                if (result.insertedCount !== 1) {
                    return {'message': 'User already exists'}
                } else {
                    return {'message': 'Created new user'}
                }
            })
    }

    getUser(userId) {
        return this.db.collection('users')
            .findOne({id: userId})
            .then(user => {
                if (user === null) {
                    return Promise.reject(error(404, 'User Not Found'))
                } else {
                    delete user._id
                    return user
                }
            })
    }

    postCalendarToUser(userId, userCalendar) {
        return this.db.collection('users')
            .updateOne({id: userId}, {
                $push: {calendars: userCalendar}
            })
            .then(result => {
                // check if update succeeded
                if (result.modifiedCount !== 1) {
                    return {'message': `Could not find calendar ${userId}`}
                } else {
                    return userCalendar
                }
            })
    }

    getUserByEmail(email){
        return this.db.collection('users')
            .findOne({email: email})
            .then(user => {
                if (user === null) {
                    return Promise.reject(error(404, 'User Not Found'))
                } else {
                    delete user._id
                    return user
                }
            })
    }

    getUserInvites(userId) {
        return this.db.collection('users')
            .findOne({id: userId})
            .then(user => {
                if (user === null) {
                    return Promise.reject(error(404, 'User Not Found'))
                } else {
                    delete user._id
                    return user
                }
            })
    }
}

module.exports = DataBaseUserMongo