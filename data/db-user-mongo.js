const MongoClient = require('mongodb').MongoClient

class DataBaseUserMongo {
    constructor(connectionString) {
        this.connect = MongoClient.connect(connectionString,
            {
                useUnifiedTopology: true
            })
            .then(client => {
                this.db = client.db('monenceDB')
            })
    }

    static init(connectionString) {
        return new DataBaseUserMongo(connectionString)
    }

    isConnected() {
        return this.connect
    }

    getUser(userId) {
        return this.db.collection('users')
            .findOne(
                {
                    id: userId
                },
                {
                    projection: {
                        _id: 0
                    }
                }
            )
    }

    createNewUser(user) {
        return this.db.collection('users')
            .insertOne(user)
            .then(result => {
                if (result.ops.length === 0)
                    return null
                else
                    return result.ops[0]
            })
    }

    deleteUser(userId) {
        return this.db.collection('users')
            .findOneAndDelete(
                {
                    id: userId
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

    getUserByEmail(email) {
        return this.db.collection('users')
            .findOne(
                {
                    email: email
                },
                {
                    projection: {
                        _id: 0
                    }
                }
            )
    }

    postCalendarToUser(userId, userCalendar) {
        return this.db.collection('users')
            .findOneAndUpdate(
                {
                    id: userId
                },
                {
                    $push: {
                        calendars: userCalendar
                    }
                },
                {
                    returnOriginal: false,
                    projection: {
                        _id: 0,
                        calendars: {
                            $filter: {
                                input: "$calendars",
                                as: "calendars",
                                cond: {$eq: ["$$calendars.id", userCalendar.id]}
                            }
                        }
                    }
                }
            )
            .then(result => {
                return result.value
            })
    }

    deleteCalendar(userId, calendarId){
        return this.db.collection('users')
            .findOneAndUpdate(
                {
                    id: userId
                },
                {
                    $pull: {
                        calendars: {
                            "id": calendarId
                        }
                    }
                },
                {
                    projection: {
                        _id: 0,
                        calendars: {
                            $filter: {
                                input: "$calendars",
                                as: "calendars",
                                cond: {$eq: ["$$calendars.id", calendarId]}
                            }
                        }
                    }
                }
            )
            .then(result => {
                return result.value
            })
    }

    postParticipating(userId, participating) {
        return this.db.collection('users')
            .findOneAndUpdate(
                {
                    id: userId
                },
                {
                    $push: {
                        participating: participating
                    }
                },
                {
                    returnOriginal: false,
                    projection: {
                        _id: 0,
                        participating: {
                            $filter: {
                                input: "$participating",
                                as: "participating",
                                cond: {$eq: ["$$participating.calendarId", participating.calendarId]}
                            }
                        }
                    }
                }
            ).then(result => {
                return result.value
            })
    }

    deleteParticipating(userId, calendarId) {
        return this.db.collection('users')
            .findOneAndUpdate(
                {
                    id: userId
                },
                {
                    $pull: {
                        participating: {
                            "calendarId": calendarId
                        }
                    }
                },
                {
                    projection: {
                        _id: 0,
                        participating: {
                            $filter: {
                                input: "$participating",
                                as: "participating",
                                cond: {$eq: ["$$participating.calendarId", calendarId]}
                            }
                        }
                    }
                }
            )
            .then(result => {
                return result.value
            })
    }

}

module.exports = DataBaseUserMongo