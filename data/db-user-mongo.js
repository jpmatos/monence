const MongoClient = require('mongodb').MongoClient
const uuid = require('short-uuid')
const error = require('../object/error')
const MONGO_USER = "defaultUser"
const MONGO_SECRET = "nJknMAc8zCAornn3"

class DataBaseUserMongo {
    constructor() {
        MongoClient.connect(`mongodb+srv://${MONGO_USER}:${MONGO_SECRET}@monencecluster.i6cih.mongodb.net/monenceDB?authSource=admin&retryWrites=true&w=majority`,
            {useUnifiedTopology: true})
            .then(client => {
                this.db = client.db('monenceDB')
            })
    }

    static init() {
        return new DataBaseUserMongo()
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