const MongoClient = require('mongodb').MongoClient

class DataBaseCalendarMongo {

    constructor(connectionString) {
        this.connect = MongoClient.connect(connectionString,
            {useUnifiedTopology: true})
            .then(client => {
                this.db = client.db('monenceDB')
            })
    }

    static init(connectionString) {
        return new DataBaseCalendarMongo(connectionString)
    }

    isConnected() {
        return this.connect
    }

    // Calendar methods
    getCalendar(calendarId) {
        return this.db.collection('calendars')
            .findOne(
                {
                    id: calendarId
                },
                {
                    projection: {
                        _id: 0
                    }
                }
            )
    }

    postCalendar(calendar) {
        return this.db.collection('calendars')
            .insertOne(calendar)
            .then(result => {
                if (result.ops.length === 0)
                    return null
                else
                    return result.ops[0]
            })
    }

    putCalendarShare(calendarId, share) {
        const newCalendar = {
            participants: []
        }
        if(share)
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

    deleteCalendar(calendarId) {
        return this.db.collection('calendars')
            .findOneAndDelete(
                {
                    id: calendarId
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

    getCalendarOwner(calendarId) {
        return this.db.collection('calendars')
            .findOne(
                {
                    id: calendarId
                },
                {
                    projection: {
                        _id: 0,
                        owner: 1
                    }
                }
            )
    }

    getCalendarOwnerAndParticipant(calendarId, participantId) {
        return this.db.collection('calendars')
            .findOne(
                {
                    id: calendarId
                },
                {
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

    getCalendarOwnerAndName(calendarId) {
        return this.db.collection('calendars')
            .findOne(
                {
                    id: calendarId
                },
                {
                    projection: {
                        _id: 0,
                        owner: 1,
                        name: 1
                    }
                }
            )
    }

    // Item methods
    postItemSingle(calendarId, item) {
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

    postItemRecurrent(calendarId, item) {
        return this.db.collection('calendars')
            .findOneAndUpdate(
                {
                    id: calendarId
                },
                {
                    $push: {recurrent: item}
                },
                {
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

    putItemSingle(calendarId, itemId, item) {
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

    putItemRecurrent(calendarId, itemId, item) {
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

    deleteItemSingle(calendarId, itemId) {
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

    deleteItemRecurrent(calendarId, itemId) {
        return this.db.collection('calendars')
            .findOneAndUpdate(
                {
                    id: calendarId
                },
                {
                    $pull: {recurrent: {"id": itemId}}
                },
                {
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
    postBudget(calendarId, budget) {
        return this.db.collection('calendars')
            .findOneAndUpdate(
                {
                    id: calendarId
                },
                {
                    $push: {budget: budget}
                },
                {
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

    putBudget(calendarId, budgetId, budget) {
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

    deleteBudget(calendarId, budgetId) {
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
    getParticipants(calendarId) {
        return this.db.collection('calendars')
            .findOne(
                {
                    id: calendarId
                },
                {
                    projection: {
                        participants: 1,
                        _id: 0
                    }
                }
            )
    }

    postCalendarParticipant(calendarId, participant) {
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

    deleteParticipant(calendarId, participantId) {
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

    putRole(calendarId, participantId, role) {
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