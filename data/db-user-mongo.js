class DataBaseUserMongo {
    constructor(mongoConnection) {
        this.connect = mongoConnection.getConnect()
            .then(() => {
                this.client = mongoConnection.getClient()
                this.db = mongoConnection.getDb()
            })
    }

    static init(mongoConnection) {
        return new DataBaseUserMongo(mongoConnection)
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

    getUser(userId, session) {
        return this.db.collection('users')
            .findOne(
                {
                    id: userId
                },
                {
                    session: session,
                    projection: {
                        _id: 0
                    }
                }
            )
    }

    createNewUser(user, session) {
        return this.db.collection('users')
            .insertOne(user, {session: session})
            .then(result => {
                if (result.ops.length === 0)
                    return null
                else
                    return result.ops[0]
            })
    }

    deleteUser(userId, session) {
        return this.db.collection('users')
            .findOneAndDelete(
                {
                    id: userId
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

    getUserByEmail(email, session) {
        return this.db.collection('users')
            .findOne(
                {
                    email: email
                },
                {
                    session: session,
                    projection: {
                        _id: 0
                    }
                }
            )
    }

    postCalendarToUser(userId, userCalendar, session) {
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
                    session: session,
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

    deleteCalendar(userId, calendarId, session) {
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
                    session: session,
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

    postParticipating(userId, participating, session) {
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
                    session: session,
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

    deleteParticipating(userId, calendarId, session) {
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
                    session: session,
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