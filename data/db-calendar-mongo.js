const MongoClient = require('mongodb').MongoClient
const error = require('../object/error')

class DataBaseCalendarMongo {

    constructor(connectionString) {
        MongoClient.connect(connectionString,
            {useUnifiedTopology: true})
            .then(client => {
                this.db = client.db('monenceDB')
            })
    }

    static init(connectionString) {
        return new DataBaseCalendarMongo(connectionString)
    }

    // calendar methods
    getCalendar(calendarId) {
        return this.db.collection('calendars')
            .findOne({id: calendarId})
            .then(calendar => {
                if (calendar === null) {
                    return Promise.reject(error(404, 'Calendar Not Found'))
                } else {
                    delete calendar._id
                    return calendar
                }
            })
    }

    putCalendar(calendarId, calendar) {
        return this.db.collection('calendars')
            .updateOne({id: calendarId}, {$set: calendar})
            .then(result => {
                // check if update succeeded
                if (result.modifiedCount !== 1) {
                    return Promise.reject(`Calendar Not Found`)
                } else {
                    return calendar
                }
            })
    }

    postCalendar(userId, calendar) {

        return this.db.collection('calendars')
            .insertOne(calendar).then(result => {
                if (result.insertedCount !== 1) {
                    return {'message': `Could not add calendar`}
                } else {
                    return calendar

                }
            })
    }

    //TODO Mock this
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

    //TODO Mock this
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

    getCalendarName(calendarId) {
        return this.db.collection('calendars')
            .findOne({id: calendarId})
            .then(calendar => {
                if (calendar === null) {
                    return Promise.reject(error(404, 'Calendar Not Found'))
                } else {
                    return calendar.name
                }
            })
    }

    // item methods

    //TODO Mock this
    postItemSingle(calendarId, item) {
        return this.db.collection('calendars')
            .findOneAndUpdate(
                {
                    id: calendarId
                },
                {
                    $push: {single: item}
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

    //TODO Mock this
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

    //TODO Mock
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

    //TODO Mock this
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

    //TODO Mock this
    deleteItemRecurrent(calendarId, itemId) {
        return this.db.collection('calendars')
            .updateOne(
                {
                    id: calendarId
                },
                {
                    $pull: {recurrent: {"id": itemId}}
                }
            )
    }

    //TODO Check if mock does the same
    deleteItemSingle(calendarId, itemId) {
        return this.db.collection('calendars')
            .updateOne(
                {
                    id: calendarId
                },
                {
                    $pull: {single: {"id": itemId}}
                }
            )
    }

    //budget methods
    //TODO Mock this
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

    //TODO Mock this
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

    //TODO Mock this
    deleteBudget(calendarId, budgetId) {
        return this.db.collection('calendars')
            .updateOne(
                {
                    id: calendarId
                },
                {
                    $pull: {budget: {"id": budgetId}}
                }
            )
    }

    getCalendars(userId) {
        return this.db.collection('users')
            .findOne({id: [userId].toString()}, {projection: {calendars: 1, _id: 0}})
            .then(calendarsObj => {
                if (calendarsObj === undefined) {
                    return {'message': `Could not find user ${userId}`}
                }

                return calendarsObj.calendars
            })
    }

    // participant methods
    getParticipants(calendarId) {
        return this.db.collection('calendars')
            .findOne({id: [calendarId].toString()}, {projection: {participants: 1, _id: 0}})
            .then(calendarsObj => {
                if (calendarsObj === undefined) {
                    return {'message': `Could not find calendar ${calendarId}`}
                }
                return calendarsObj.participants
            })
    }

    postCalendarParticipant(calendarId, participant) {
        return this.db.collection('calendars')
            .updateOne({id: calendarId}, {
                $push: {participants: participant}
            })
            .then(result => {
                // check if update succeeded
                if (result.modifiedCount !== 1) {
                    return {'message': `Could not find calendar ${calendarId}`}
                } else {
                    return participant
                }
            })
    }

    deleteParticipant(calendarId, participantId) {
        return this.db.collection('calendars')
            .updateOne({id: calendarId}, {$pull: {participants: {"id": participantId}}})
            .then(result => {
                // check if update succeeded
                if (result.modifiedCount !== 1) {
                    return {'message': `Could not find calendar ${calendarId}`}
                } else {
                    return {'message': `Deleted participant ${participantId}`}
                }
            })
    }

    //TODO Mock this
    putRole(calendarId, participantId, role) {
        return this.db.collection('calendars')
            .findOneAndUpdate({id: calendarId, "participants.id": participantId},
                {
                    $set: {
                        "participants.$.role": role
                    }
                }, {returnOriginal: false})
            .then(result => {
                return result.value.participants.find(par => par.id === participantId)
            })
    }


}

module.exports = DataBaseCalendarMongo