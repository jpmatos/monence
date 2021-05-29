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

    verifyNewUser(userId, name, emails, photos) {
        return this.db.collection('users')
            .updateOne(
                {id: [userId].toString()},
                {
                    $setOnInsert: {
                        'id': userId,
                        'name': name,
                        'emails': emails,
                        'photos': photos,
                        'calendars': []
                    }
                },
                {upsert: true})
            .then(result => {
                // check if update succeeded
                if (result.nMatched === 1) {
                    return {'message': 'User already exists'}
                } else {
                    return {'message': 'Created new user'}
                }
            })
    }

}

module.exports = DataBaseUserMongo