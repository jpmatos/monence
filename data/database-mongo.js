const MongoClient = require('mongodb').MongoClient
const uuid = require('short-uuid')

class MonenceMongoDB {

    static init(user, password) {
        MongoClient.connect(`mongodb+srv://${user}:${password}@monencecluster.i6cih.mongodb.net/monenceDB?retryWrites=true&w=majority`)
            .then(client => {
                this.db = client.db('monenceDB')
            })
        return MonenceMongoDB
    }

    static getCalendar(calendarId) {
        return this.db.collection('calendars')
            .findOne({id: calendarId})
            .then(calendar => {
                if (calendar === null) {
                    return {'message': `Could not find calendar ${calendarId}`}
                }
                delete calendar._id
                return calendar
            })
    }

    static postItem(calendarId, item, arrayName) {
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

    static deleteItem(calendarId, itemId, arrayName) {
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

    static putItem(calendarId, itemId, item, arrayName) {
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

    static postBudget(calendarId, budget) {
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

    static putBudget(calendarId, budgetId, budget) {
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

    static verifyNewUser(userId, name, emails, photos) {
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

    static getCalendars(userId) {
        return this.db.collection('users')
            .findOne({id: [userId].toString()}, {projection: {calendars: 1, _id: 0}})
            .then(calendarsObj => {
                if (calendarsObj === undefined) {
                    return {'message': `Could not find user ${userId}`}
                }

                return calendarsObj.calendars
            })
    }

    static postCalendar(userId, calendar) {
        calendar.id = uuid.generate()
        return this.db.collection('users')
            .updateOne(
                {id: [userId].toString()},
                {
                    $push: {calendars: calendar}
                })
            .then(result => {
                // check if update succeeded and add calendar
                if (result.modifiedCount !== 1) {
                    return {'message': `Could not find user ${userId}`}
                } else {
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
            })
    }

}

module.exports = MonenceMongoDB.init('dbDefaultUser', 'YFWytbUn49uf31QN')