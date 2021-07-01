class DataBaseCalendarMongo {
    constructor(mongoConnection) {
        this.connect = mongoConnection.getConnect()
            .then(() => {
                this.client = mongoConnection.getClient()
                this.db = mongoConnection.getDb()
            })
    }

    static init(mongoConnection) {
        return new DataBaseCalendarMongo(mongoConnection)
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

    // Calendar methods
    getCalendar(calendarId, session) {
        return this.db.collection('calendars')
            .findOne(
                {
                    id: calendarId
                },
                {
                    session: session,
                    projection: {
                        _id: 0
                    }
                }
            )
    }

    postCalendar(calendar, session) {
        return this.db.collection('calendars')
            .insertOne(calendar, {session: session})
            .then(result => {
                if (result.ops.length === 0)
                    return null
                else
                    return result.ops[0]
            })
    }

    putCalendarShare(calendarId, share, session) {
        const newCalendar = {
            participants: []
        }
        if (share)
            newCalendar.share = share

        return this.db.collection('calendars')
            .findOneAndUpdate(
                {
                    id: calendarId
                },
                {
                    $set: newCalendar
                },
                {
                    session: session,
                    returnOriginal: false,
                    projection: {
                        _id: 0,
                        share: 1,
                        participants: 1
                    }
                }
            )
            .then(result => {
                return result.value
            })
    }

    deleteCalendar(calendarId, session) {
        return this.db.collection('calendars')
            .findOneAndDelete(
                {
                    id: calendarId
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

    getCalendarOwner(calendarId, session) {
        return this.db.collection('calendars')
            .findOne(
                {
                    id: calendarId
                },
                {
                    session: session,
                    projection: {
                        _id: 0,
                        owner: 1
                    }
                }
            )
    }

    getCalendarOwnerAndParticipant(calendarId, participantId, session) {
        return this.db.collection('calendars')
            .findOne(
                {
                    id: calendarId
                },
                {
                    session: session,
                    projection: {
                        _id: 0,
                        owner: 1,
                        participants: {
                            $filter: {
                                input: "$participants",
                                as: "participants",
                                cond: {$eq: ["$$participants.id", participantId]}
                            }
                        }
                    }
                }
            )
    }

    getCalendarOwnerAndName(calendarId, session) {
        return this.db.collection('calendars')
            .findOne(
                {
                    id: calendarId
                },
                {
                    session: session,
                    projection: {
                        _id: 0,
                        owner: 1,
                        name: 1
                    }
                }
            )
    }

    // Item methods
    postItemSingle(calendarId, item, session) {
        return this.db.collection('calendars')
            .findOneAndUpdate(
                {
                    id: calendarId
                },
                {
                    $push: {
                        single: item
                    }
                },
                {
                    session: session,
                    returnOriginal: false,
                    projection: {
                        _id: 0,
                        single: {
                            $filter: {
                                input: "$single",
                                as: "single",
                                cond: {$eq: ["$$single.id", item.id]}
                            }
                        }
                    }
                }
            )
            .then(result => {
                return result.value
            })
    }

    postItemRecurrent(calendarId, item, session) {
        return this.db.collection('calendars')
            .findOneAndUpdate(
                {
                    id: calendarId
                },
                {
                    $push: {recurrent: item}
                },
                {
                    session: session,
                    returnOriginal: false,
                    projection: {
                        _id: 0,
                        recurrent: {
                            $filter: {
                                input: "$recurrent",
                                as: "recurrent",
                                cond: {$eq: ["$$recurrent.id", item.id]}
                            }
                        }
                    }
                }
            )
            .then(result => {
                return result.value
            })
    }

    putItemSingle(calendarId, itemId, item, session) {
        const newItem = {}
        if (item.start)
            newItem["single.$.start"] = item.start
        if (item.title)
            newItem["single.$.title"] = item.title
        if (item.value)
            newItem["single.$.value"] = item.value

        return this.db.collection('calendars')
            .findOneAndUpdate(
                {
                    id: calendarId,
                    "single.id": itemId
                },
                {
                    $set: newItem
                },
                {
                    session: session,
                    returnOriginal: false,
                    projection: {
                        _id: 0,
                        single: {
                            $filter: {
                                input: "$single",
                                as: "single",
                                cond: {$eq: ["$$single.id", itemId]}
                            }
                        }
                    }
                })
            .then(result => {
                return result.value
            })
    }

    putItemRecurrent(calendarId, itemId, item, session) {
        const newItem = {}
        if (item.start)
            newItem["recurrent.$.start"] = item.start
        if (item.end)
            newItem["recurrent.$.end"] = item.end
        if (item.title)
            newItem["recurrent.$.title"] = item.title
        if (item.value)
            newItem["recurrent.$.value"] = item.value

        return this.db.collection('calendars')
            .findOneAndUpdate(
                {
                    id: calendarId,
                    "recurrent.id": itemId
                },
                {
                    $set: newItem
                },
                {
                    session: session,
                    returnOriginal: false,
                    projection: {
                        _id: 0,
                        recurrent: {
                            $filter: {
                                input: "$recurrent",
                                as: "recurrent",
                                cond: {$eq: ["$$recurrent.id", itemId]}
                            }
                        }
                    }
                })
            .then(result => {
                return result.value
            })
    }

    deleteItemSingle(calendarId, itemId, session) {
        return this.db.collection('calendars')
            .findOneAndUpdate(
                {
                    id: calendarId
                },
                {
                    $pull: {
                        single: {
                            "id": itemId
                        }
                    }
                },
                {
                    session: session,
                    projection: {
                        _id: 0,
                        single: {
                            $filter: {
                                input: "$single",
                                as: "single",
                                cond: {$eq: ["$$single.id", itemId]}
                            }
                        }
                    }
                }
            )
            .then(result => {
                return result.value
            })
    }

    deleteItemRecurrent(calendarId, itemId, session) {
        return this.db.collection('calendars')
            .findOneAndUpdate(
                {
                    id: calendarId
                },
                {
                    $pull: {recurrent: {"id": itemId}}
                },
                {
                    session: session,
                    projection: {
                        _id: 0,
                        recurrent: {
                            $filter: {
                                input: "$recurrent",
                                as: "recurrent",
                                cond: {$eq: ["$$recurrent.id", itemId]}
                            }
                        }
                    }
                }
            )
            .then(result => {
                return result.value
            })
    }

    // Budget methods
    postBudget(calendarId, budget, session) {
        return this.db.collection('calendars')
            .findOneAndUpdate(
                {
                    id: calendarId
                },
                {
                    $push: {budget: budget}
                },
                {
                    session: session,
                    returnOriginal: false,
                    projection: {
                        _id: 0,
                        budget: {
                            $filter: {
                                input: "$budget",
                                as: "budget",
                                cond: {$eq: ["$$budget.id", budget.id]}
                            }
                        }
                    }
                })
            .then(result => {
                return result.value
            })
    }

    putBudget(calendarId, budgetId, budget, session) {
        const newBudget = {}
        if (budget.date)
            newBudget["budget.$.date"] = budget.date
        if (budget.value)
            newBudget["budget.$.value"] = budget.value
        return this.db.collection('calendars')
            .findOneAndUpdate(
                {
                    id: calendarId,
                    "budget.id": budgetId
                },
                {
                    $set: newBudget
                },
                {
                    session: session,
                    returnOriginal: false,
                    projection: {
                        _id: 0,
                        budget: {
                            $filter: {
                                input: "$budget",
                                as: "budget",
                                cond: {$eq: ["$$budget.id", budgetId]}
                            }
                        }
                    }
                })
            .then(result => {
                return result.value
            })
    }

    deleteBudget(calendarId, budgetId, session) {
        return this.db.collection('calendars')
            .findOneAndUpdate(
                {
                    id: calendarId
                },
                {
                    $pull: {
                        budget: {
                            "id": budgetId
                        }
                    }
                },
                {
                    session: session,
                    projection: {
                        _id: 0,
                        budget: {
                            $filter: {
                                input: "$budget",
                                as: "budget",
                                cond: {$eq: ["$$budget.id", budgetId]}
                            }
                        }
                    }
                }
            )
            .then(result => {
                return result.value
            })
    }

    // Participant methods
    getParticipants(calendarId, session) {
        return this.db.collection('calendars')
            .findOne(
                {
                    id: calendarId
                },
                {
                    session: session,
                    projection: {
                        _id: 0,
                        participants: 1
                    }
                }
            )
    }

    postCalendarParticipant(calendarId, participant, session) {
        return this.db.collection('calendars')
            .findOneAndUpdate(
                {
                    id: calendarId
                },
                {
                    $push: {
                        participants: participant
                    }
                },
                {
                    session: session,
                    returnOriginal: false,
                    projection: {
                        _id: 0,
                        participants: {
                            $filter: {
                                input: "$participants",
                                as: "participants",
                                cond: {$eq: ["$$participants.id", participant.id]}
                            }
                        }
                    }
                }
            ).then(result => {
                return result.value
            })
    }

    deleteParticipant(calendarId, participantId, session) {
        return this.db.collection('calendars')
            .findOneAndUpdate(
                {
                    id: calendarId
                },
                {
                    $pull: {
                        participants:
                            {
                                "id": participantId
                            }
                    }
                },
                {
                    session: session,
                    projection: {
                        _id: 0,
                        participants: {
                            $filter: {
                                input: "$participants",
                                as: "participants",
                                cond: {$eq: ["$$participants.id", participantId]}
                            }
                        }
                    }
                }
            )
            .then(result => {
                return result.value
            })
    }

    putRole(calendarId, participantId, role, session) {
        return this.db.collection('calendars')
            .findOneAndUpdate(
                {
                    id: calendarId,
                    "participants.id": participantId
                },
                {
                    $set: {
                        "participants.$.role": role
                    }
                },
                {
                    session: session,
                    returnOriginal: false,
                    projection: {
                        _id: 0,
                        participants: {
                            $filter: {
                                input: "$participants",
                                as: "participants",
                                cond: {$eq: ["$$participants.id", participantId]}
                            }
                        }
                    }
                })
            .then(result => {
                return result.value
            })
    }
}

module.exports = DataBaseCalendarMongo