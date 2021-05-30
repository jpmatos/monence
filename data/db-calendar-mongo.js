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

    postItem(calendarId, item, arrayName) {
        return this.db.collection('calendars')
            .updateOne({id: calendarId}, {$push: {[arrayName]: item}})
            .then(result => {
                // check if update succeeded
                if (result.modifiedCount !== 1) {
                    return {'message': `Could not find calendar ${calendarId}`}
                } else {
                    return item
                }
            })
    }

    deleteItem(calendarId, itemId, arrayName) {
        return this.db.collection('calendars')
            .updateOne({id: calendarId}, {$pull: {[arrayName]: {"id": itemId}}})
            .then(result => {
                // check if update succeeded
                if (result.modifiedCount !== 1) {
                    return {'message': `Could not find calendar ${calendarId}`}
                } else {
                    return {'message': `Deleted item with id ${itemId}`}
                }
            })
    }

    putItem(calendarId, itemId, item, arrayName) {
        return this.db.collection('calendars')
            .updateOne({id: calendarId, [arrayName]: {"id": itemId}},
                {
                    $set: {
                        start: item.start,
                        end: item.end,
                        title: item.title,
                        value: item.value
                    }
                })
            .then(result => {
                // check if update succeeded
                if (result.modifiedCount !== 1) {
                    return {'message': `Could not find calendar ${calendarId}`}
                } else {
                    return item
                }
            })
    }

    postBudget(calendarId, budget) {
        return this.db.collection('calendars')
            .updateOne({id: calendarId}, {
                $push: {budget: budget}
            })
            .then(result => {
                // check if update succeeded
                if (result.modifiedCount !== 1) {
                    return {'message': `Could not find calendar ${calendarId}`}
                } else {
                    return budget
                }
            })
    }

    putBudget(calendarId, budgetId, budget) {
        return this.db.collection('calendars')
            .findOneAndUpdate({id: calendarId, "budget.id": budgetId},
                {
                    $set: {
                        "budget.$.date": budget.date,
                        "budget.$.value": budget.value
                    }
                })
            .then(result => {
                // check if update succeeded
                if (result.ok !== 1) {
                    return {'message': `Could not find calendar ${calendarId}`}
                } else {
                    return result.value.budget.find((element) => {
                        if (element.id === budgetId) {
                            element.date = budget.date
                            element.value = budget.value
                            return element
                        }
                    })
                }
            })
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

    deleteBudget(calendarId, budgetId) {

    }

    postCalendar(userId, calendar) {

        return this.db.collection('calendars')
            .insertOne({
                "name": calendar.name,
                "ownerId": userId,
                "id": calendar.id,
                "single": [],
                "recurrent": [],
                "budget": []

            }).then(result => {
                if (result.insertedCount !== 1) {
                    return {'message': `Could not add calendar`}
                } else {
                    return calendar

                }
            })
    }


}

module.exports = DataBaseCalendarMongo